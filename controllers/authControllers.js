import users from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const existing_email = await users.findOne({
      email: req.body.email,
    });
    const existing_phone = await users.findOne({
      phone: req.body.phone,
    });
    if (existing_email || existing_phone) {
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
    const user_email = req.body.email;
    const existing_user = await users.findOne({ email: user_email });
    if (!existing_user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Better sign up",
      });
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
