// third-party modules
import { validationResult } from "express-validator";

import { Request, Response } from "express";

// models
import { User } from "../models/userModel";

// my functions to make a code more readable
import { hashPassword, comparePassword, generateToken } from "../helpers/utils";
import { verifyJWT } from "../services/google";

// retrieves users from the database
export const getUsers = async (req: Request, res: Response) => {
  /* try/catch helps to see what errors occured during async functions
     and fix them quickly as you know what a problem is */
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "age", "logged_in", "avatar_url"],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving users from the database`);
  }
};

// Retrieves a single user from the Postgres database based on the provided id
export const getUserById = async (req: Request, res: Response) => {
  try {
    // extracts userId from req.params using destructuring assignment
    const { userId } = req.params;

    // retrieves the user from the database with specific id
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json("There is no user with such id");

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error retrieving the user from database`);
  }
};

// Updates a single user in the Postgres database based on the provided id
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { name, email, age, userId } = req.params;
    if (!name || !email || !age) {
      return res.status(400).json(`There are no all required fields in query`);
    }

    return res.status(200).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error updating the user in database`);
  }
};

// creates a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, age, password } = req.body;

    // handles errors of the express-validator's middleware
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // hashes the password
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      age,
      hashed_password: hashedPassword,
      token: "1",
    });

    return res.status(200).json({ newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json(`Error creating the user`);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    // const { id, username, hashed_password } = await getUserByEmail(email);
    const existingUser = await User.findOne({
      where: { email },
    });
    if (!existingUser) {
      return res.status(400).json("There is no user with such email");
    }

    const { id, username, hashed_password } = existingUser.dataValues;

    if (!id || !username || !hashed_password) {
      return res.status(404).json(`Some of the select data is empty`);
    }

    // compares the provided password with the database password
    const isValidPassword = await comparePassword(password, hashed_password);
    if (!isValidPassword) {
      return res.status(400).json(`Invalid password`);
    }

    // generates a new token
    const token = await generateToken(id, email, remember);

    // updates the user's token in the database
    // await updateUserToken(token, id);
    await User.update({ token }, { where: { email } });

    return res.status(200).json({
      token: token,
      user: { id: id, username: username, email: email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error logging the user in");
  }
};

export const authGoogle = async (req: Request, res: Response) => {
  try {
    const { tokenGoogle } = req.body;
    if (!tokenGoogle) return res.status(400).json("Google token is missing");
    const user = await verifyJWT(process.env.GOOGLE_CLIENT_ID, tokenGoogle);
    if (!user) return res.status(401).json("Token was not verified by Google");

    const existingUser = await User.findOne({ where: { email: user.email } });
    let token: string;
    if (!existingUser) {
      const newUser = await User.create({
        username: user.name,
        email: user.email,
        age: 0,
        hashed_password: user.sub,
        avatar_url: user.picture,
        token: "1",
      });
      const { id, username, email } = newUser.dataValues;
      token = await generateToken(id, email);
      await User.update({ token }, { where: { email } });
      return res.status(200).json({
        token,
        user: {
          id,
          username,
          email,
        },
        user_avatar: user.picture,
        message: "User was authenticated via Google",
      });
    } else {
      token = await generateToken(1, "some@gmail.com");
      await User.update({ token }, { where: { email: user.email } });
      return res.status(200).json({
        token,
        user: existingUser,
        user_avatar: user.picture,
        message: "User was authenticated via Google",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error signing user in via Google");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!user_id)
      return res.status(400).json("There is no user_id provided in req.params");

    const deletedUser = await User.destroy({ where: { id: user_id } });
    if (deletedUser === 0)
      return res.status(404).json("There is no user with such id");
    return res.status(200).json("User was deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).json("Error deleting a user");
  }
};
