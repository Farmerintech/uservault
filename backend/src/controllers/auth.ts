import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "../validator/auth";
import users from "../models/users";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SignOptions} from "jsonwebtoken";
import { SendMail } from "../utils/nodemail";
import { generateOTP } from "../utils/generateOtp";
import { getOtpEmailHTML } from "../utils/html";
import { Document } from "mongoose";
import { decryptData, encryptData } from "../utils/crypto";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

interface JwtPayload {
    id: any,
    email: string,
}

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /* ---------- VALIDATION ---------- */
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { email, password } = value;

    /* ---------- CHECK USER ---------- */
    const user = await users.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    /* ---------- COMPARE PASSWORD ---------- */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }
    const isVerified = user.isVerified;
    if(!isVerified){
       res.status(401).json({
        success: false,
        message: "This email is not yet verified",
      });
      return;
    }
    const payload: JwtPayload = {
      id: user._id,
      email:user.email
    };
    /* ---------- GENERATE TOKEN ---------- */
   const JWT_SECRET = process.env.JWT_SECRET as string;
   const JWT_EXPIRES = process.env.JWT_EXPIRES_IN as string;

   const token = jwt.sign(
  payload as object,
  JWT_SECRET as jwt.Secret,
  {
    expiresIn: JWT_EXPIRES,
  } as jwt.SignOptions
);

    /* ---------- RESPONSE ---------- */
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// ================= CHANGE PASSWORD =================
export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // Assume user is authenticated and user ID is in req.user
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};




/* ---------------- CREATE USER ---------------- */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const expireTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await users.create({
      username,
      email,
      password: hashedPassword,
      verification_otp: {
        otp,
        expireTime,
        isExpired: false,
      },
      isVerified: false,
      files: [],
    });

    const html = getOtpEmailHTML(otp);
    await SendMail(email, "Your UserVault OTP", html);

    return res.status(201).json({
      success: true,
      message: "User created successfully, OTP sent",
      data: { id: user._id, email: user.email, username: user.username },
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });

    const verification = user.verification_otp;
    if (!verification || verification.isExpired || verification.otp !== otp)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (!verification.expireTime)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (verification.expireTime < new Date())
      return res.status(400).json({ message: "OTP has expired" });

    user.isVerified = true;
    user.verification_otp = { otp: undefined, expireTime: undefined, isExpired: true };
    await user.save();

    return res.json({ message: "Account verified successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/* ---------------- RESEND OTP ---------------- */
export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User is already verified" });

    const otp = generateOTP();
    const expireTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verification_otp = { otp, expireTime, isExpired: false };
    await user.save();

    const html = getOtpEmailHTML(otp);
    await SendMail(email, "Your UserVault OTP", html);

    return res.json({ message: "OTP resent successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email" });

    const otp = generateOTP();
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetOTP = { otp, expireTime, isExpired: false };
    await user.save();

    const encryptedOtp = encryptData(otp);
    const resetLink = `https://uservault-two.vercel.app/reset_password?email=${email}&resetId=${encryptedOtp}`;
    const html = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
    await SendMail(email, "Password Reset Link", html);

    return res.json({ message: "Reset link sent to your email" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

/* ---------------- RESET PASSWORD ---------------- */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, resetId, newPassword } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resetOTP || user.resetOTP.isExpired)
      return res.status(400).json({ message: "OTP expired or invalid" });

    const decryptedOtp = decryptData(resetId);
    if (decryptedOtp !== user.resetOTP.otp)
      return res.status(400).json({ message: "Invalid reset link" });

    if (!user.resetOTP.expireTime)
      return res.status(400).json({ message: "Reset link invalid" });

    if (user.resetOTP.expireTime < new Date())
      return res.status(400).json({ message: "Reset link has expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = { otp: undefined, expireTime: undefined, isExpired: true };
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
