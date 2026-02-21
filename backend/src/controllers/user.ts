import { Request, Response } from "express";
import bcrypt from "bcrypt";
import users from "../models/users";

/**
 * @desc    Get user account by email
 * @route   GET /api/users/:email
 * @access  Private
 */
export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await users.findOne({ email }).select("-password -verification_otp -resetOTP");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    Edit / update user account
 * @route   PUT /api/users/:email
 * @access  Private
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { username, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (username) user.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/:email
 * @access  Private
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await users.findOneAndDelete({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc    Reset access code for user
 * @route   POST /api/users/:email/reset-access-code
 * @access  Private
 */
export const resetAccessCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const {newAccessCode} =req.body
    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate new random access code (6-digit)
    // const newAccessCode = crypto.randomInt(100000, 999999).toString();

    user.access_code = newAccessCode;
    await user.save();

    res.status(200).json({ success: true, message: "Access code reset successfully", access_code: newAccessCode });
  } catch (err) {
    console.error("Reset Access Code Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};