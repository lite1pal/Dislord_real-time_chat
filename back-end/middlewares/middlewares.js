// third-party modules
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const isToken = jwt.verify(token, process.env.TOKEN_KEY);
    if (!isToken) {
      res.status(400).json(`Invalid token or no token at all`);
      return;
    }
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie("token");
    return res.status(400).json(`Log in to go on`);
  }
};

const validateInputCreateUser = [
  body("username").notEmpty().withMessage("Username is required."),
  body("age")
    .notEmpty()
    .withMessage("Age is required.")
    .isNumeric()
    .withMessage("Invalid type"),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must to be at least 8 characters"),
];

const validateInputLoginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must to be at least 8 characters"),
  body("remember")
    .isBoolean()
    .withMessage("Remember has to be a boolean value"),
];

module.exports = { auth, validateInputCreateUser, validateInputLoginUser };
