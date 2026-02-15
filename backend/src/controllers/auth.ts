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

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
/**
 * @desc    Create New User
 * @route   POST /api/users
 * @access  Public
 */



export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /* ---------------- VALIDATE INPUT ---------------- */
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
      return;
    }

    const { username, email, password,  } = value;

    /* ---------------- CHECK IF USER EXISTS ---------------- */
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    /* ---------------- HASH PASSWORD ---------------- */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP(); // e.g. "482913"
    const html = getOtpEmailHTML(otp);

    /* ---------------- CREATE USER ---------------- */
    const user = await users.create({
      username,
      email,
      password: hashedPassword,
      otp:otp,
    });
    


    SendMail(email, "Your UserVault OTP", html)
    /* ---------------- RESPONSE ---------------- */
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



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


// ================= FORGOT PASSWORD (SEND OTP) =================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await users.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account with this email" });

    // Generate OTP
     const otp = generateOTP(); // e.g. "482913"
    const html = getOtpEmailHTML(otp);
    user.resetOTP = otp;
    user.resetOTPExpire = new Date(Date.now() + 10 * 60 * 1000); // valid 10 minutes
    await user.save();

  SendMail(email, "Password reset OTP", html)


    res.json({ message: "OTP sent to your email" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// ================= RESET PASSWORD USING OTP =================
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await users.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};




interface VerifyOtpRequest extends Request {
  body: {
    email: string;
    otp: string;
  };
}

// ================= VERIFY OTP DURING REGISTRATION =================
export const verifyOtp = async (req: VerifyOtpRequest, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User is already verified" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // If OTP matches, update user
    user.isVerified = true;
    user.otp = undefined; // clear OTP
    await user.save();

    return res.json({ message: "Account verified successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};


export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Optional: prepare email HTML
    const html = getOtpEmailHTML(otp);

    // Update user OTP and save
    user.otp = otp;
    await user.save();

    // TODO: send the OTP via email here

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


