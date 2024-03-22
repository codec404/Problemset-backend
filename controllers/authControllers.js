import users from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { transporter } from "../config/mail.js";

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

    //GENERATE RANDOM PIN
    const n = crypto.randomInt(0, 1000000);
    const pin = n.toString().padStart(6, "0");

    if (req.body.isAdmin === true) {
      // SEND MAIL
      const mailOptions = {
        from: "sapta21ee8103nitdgp@gmail.com",
        to: req.body.email,
        subject: "Admin Pin",
        text: `Your admin pin is: ${pin}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          throw error;
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    const user = new users(req.body);
    if (req.body.isAdmin === true) user.adminPin = pin;
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
      existing_user = await users.findOne({
        email: user_usernameOrEmail,
      });
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
    
    if (req.body.isAdmin) {
      if (req.body.pin !== user.adminPin) {
        return res.status(401).send({
          success: false,
          message: "Wrong Credentials",
        });
      }
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
    user.password = undefined;
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

// FORGOT PASSWORD CONTROLLER
export const forgotPasswordController = async (req, res) => {
  try {
    const existing_user = await users.findOne({
      email: req.body.email,
    });
    if (!existing_user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // CREATE TOKEN
    const token = jwt.sign(
      {
        userId: existing_user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const mailOptions = {
      from: "sapta21ee8103nitdgp@gmail.com",
      to: req.body.email,
      subject: "Password Reset",
      text: `Click the link to reset the password : http://localhost:5173/reset-password/${existing_user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw error;
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).send({
      success: true,
      message: "Reset Link Sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot-password api",
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { id, token } = req.params;
    const password = req.body.password;
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Something went wrong",
      });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        throw err;
      } else {
        await users.findByIdAndUpdate(
          { _id: id },
          { password: hashedPassword }
        );

        return res.status(200).send({
          success: true,
          message: "Successfully Updated the password",
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in reset-password api",
    });
  }
};
