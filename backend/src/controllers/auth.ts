import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "../validator/auth";
import users from "../models/users";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SignOptions} from "jsonwebtoken";
import { SendMail } from "../utils/resend";
import { generateOTP } from "../utils/generateOtp";
import { getOtpEmailHTML, Resethtml } from "../utils/html";
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
    authLevel: number
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
     const iscompleted = user.isCompleted;
    if(!iscompleted){
       res.status(401).json({
        success: false,
        message: "You have not yet complete face biometric, proceed to face biometric",
      });
      return;
    }
    const payload: JwtPayload = {
      id: user._id,
      email:user.email,
      authLevel: 1,
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
      message: "Password verified. Proceed to face verification.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        token
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error", error,
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
    // const html = `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`;
    const html =Resethtml(resetLink)
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





/* =========================================
   DELETE ALL USERS (ADMIN ONLY)
========================================= */
export const deleteAllUsers = async (req: any, res: Response) => {
  try {
    // Ensure only admin can perform this action
    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({
    //     message: "Access denied. Admins only."
    //   });
    // }

    const result = await users.deleteMany({});

    res.status(200).json({
      message: "All users deleted successfully",
      deletedCount: result.deletedCount
    });
    return
  } catch (error) {
    res.status(500).json({
      message: "Error deleting users",
      error
    });
    return
  }
};



// controllers/faceCompareController.ts





// ✅ Load models once at server start

import fetch from "node-fetch";
import FormData from "form-data"; // Node.js version

// Middleware: upload.single('image') will put file in req.file


export const compareFaceController = async (req: any, res: Response) => {
  try {
    // 1️⃣ Check uploaded image
    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    // 2️⃣ Verify JWT
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.authLevel !== 1) {
      return res.status(403).json({ message: "Invalid authentication stage" });
    }

    // 3️⃣ Get user & check if face exists
    const user = await users.findById(decoded.id);
    if (!user || !user.faceImage) {
      return res.status(404).json({ message: "User face not found" });
    }

    // 4️⃣ Prepare FormData for Luxand
    const formData = new FormData();

    // Uploaded file from memoryStorage
    formData.append("face1", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // User stored face (URL)
    formData.append("face2", user.faceImage);

    // Optional threshold
    formData.append("threshold", "0.8");

    // 5️⃣ Send request to Luxand
    const response = await fetch("https://api.luxand.cloud/photo/similarity", {
      method: "POST",
      headers: {
        token: process.env.LUXAND_API_KEY as string,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const result = await response.json();
    console.log("Luxand API raw response:", result, user.faceImage, req.file);

    if (!result.similarity) {
      return res.status(400).json({ message: "Face comparison failed", luxandResult: result, 
        images: `${user.faceImage, req.file}`});
    }

    const similarity = result.similarity * 100;

    if (similarity <= 65) {
      return res.status(401).json({
        success: false,
        message: `Face verification failed. Similarity: ${similarity.toFixed(2)}%`,
        verified: false,
        luxandResult: result,
      });
    }

    // 6️⃣ Generate upgraded JWT for user
    const payload: JwtPayload = {
      id: user._id,
      email: user.email,
      authLevel: 2,
    };
    const JWT_SECRET = process.env.JWT_SECRET as string;
    const JWT_EXPIRES = process.env.JWT_EXPIRES_IN as string;
const finalToken = jwt.sign( payload as object, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRES, } as jwt.SignOptions );
    // 7️⃣ Respond with success
    res.status(200).json({
      success: true,
      message: "Face verification successful",
      token: finalToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      similarity: similarity.toFixed(2),
      luxandResult: result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};