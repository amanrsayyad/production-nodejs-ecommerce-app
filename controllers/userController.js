import { token } from "morgan";
import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, mobile, password, state } = req.body;
    // Validation
    if (!name || !email || !mobile || !password || !state) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // Check existing user
    const existingUser = await userModel.findOne({
      email,
    });
    // Validation
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "Email already taken",
      });
    }
    const user = await userModel.create({
      name,
      email,
      mobile,
      password,
      state,
    });
    res.status(201).send({
      success: true,
      message: "Registration Success, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { mobile, password } = req.body;
    // Validation
    if (!mobile || !password) {
      return res.status(500).send({
        success: false,
        message: "Please Add Email OR Password",
      });
    }
    // Check User
    const user = await userModel.findOne({ mobile });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    // Check pass
    const isMatch = await user.comparePassword(password);
    // Validation pass
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid credentials",
      });
    }
    // TOKEN
    const token = user.generateToken();
    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login Successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error,
    });
  }
};

// GET USER PROFILE
export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Profile API",
      error,
    });
  }
};

// LOGOUT
export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });
  }
};

// Update Password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    // validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    // old check
    const isMatch = await user.comparePassword(oldPassword);
    // validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Update Password API",
      error,
    });
  }
};
