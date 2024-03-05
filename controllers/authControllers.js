import users from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const existing_email = await users.findOne({
      email: req.body.email,
    });
    const existing_username = await users.findOne({
      username: req.body.username,
    });
    if (existing_email || existing_username) {
      console.log("User already exists");
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }
    //HASHING PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = new users(req.body);
    await user.save();
    res.status(200).send({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register api",
    });
  }
};

export const loginController = async (req, res) => {
  //LOGIN USER
  try {
    const user_usernameOrEmail = req.body.usernameOrEmail;
    let existing_user = await users.findOne({
      username: user_usernameOrEmail,
    });
    if (!existing_user) {
      existing_user = await users.findOne({ email: user_usernameOrEmail });
      if (!existing_user) {
        return res.status(404).send({
          success: false,
          message: "User not found. Better sign up",
        });
      }
    }
    const user = existing_user;
    const user_password = req.body.password;

    //COMPARE PASSWORD
    const comparePassword = await bcrypt.compare(user_password, user.password);
    if (!comparePassword) {
      return res.status(401).send({
        success: false,
        message: "Wrong credentials",
      });
    }

    //CREATE TOKEN
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).send({
      success: true,
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login api",
    });
  }
};

//GET CURRENT USER
export const currentUserController = async (req, res) => {
  try {
    const user = await users.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User data fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Cannot get current user",
      error,
    });
  }
};
