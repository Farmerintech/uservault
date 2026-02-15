import { Request, Response } from "express";
import { createUserSchema, loginSchema } from "../validator/auth";
import users from "../models/users";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SignOptions} from "jsonwebtoken";

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

    const { firstName, lastName, email, password, gender } = value;

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

    /* ---------------- CREATE USER ---------------- */
    const user = await users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
    });

    /* ---------------- RESPONSE ---------------- */
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
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
        firstName: user.firstName,
        lastName: user.lastName,
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
