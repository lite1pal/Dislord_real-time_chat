import { pool } from "../database/db";
import { Request, Response } from "express";

import { Friend } from "../models/friendModel";

export const getFriendsOfUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(404).json(`user_id is required.`);

    const { rows } = await pool.query({
      text: "SELECT * FROM friends WHERE user_id = $1",
      values: [user_id],
    });

    return res.status(200).json(rows);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured retrieving friends.");
  }
};

export const getFriendById = async (req: Request, res: Response) => {
  try {
    return res.status(200).json("The friend was retrieved.");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured retrieving the friend.");
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { user_id, friend_id } = req.body;
    if (!user_id || !friend_id)
      return res.status(404).json("Both user_id and friend_id are required.");

    const result = await pool.query({
      text: "INSERT INTO friends (user_id, friend_id) VALUES $1, $2 RETURNING *",
      values: [user_id, friend_id],
    });

    const friend = result.rows[0];
    return res
      .status(201)
      .json({ message: "Friend added successfully", friend });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured while adding the friend.");
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { user_id, friend_id } = req.body;
    if (!user_id || !friend_id)
      return res.status(404).json("Both user_id and friend_id are required.");

    await pool.query({
      text: "UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id $2",
      values: [user_id, friend_id],
    });
    return res.status(200).json("the request status is updated");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("Error updating request status");
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friend_id } = req.body;
    if (!friend_id)
      return res.status(404).json("Friend_id was not provided in req.body");

    await pool.query({
      text: "DELETE FROM friends WHERE friend_id = $1",
      values: [friend_id],
    });

    return res.status(200).json("The friend is removed");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("Error removing a friend");
  }
};
