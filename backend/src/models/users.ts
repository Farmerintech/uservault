import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

interface VerificationOtp {
  otp?: string;
  isExpired?: boolean;
  expireTime?: Date;
}

interface ResetOtp {
  otp?: string;
  isExpired?: boolean;
  expireTime?: Date;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verification_otp: VerificationOtp;
  access_code?: string;
  resetOTP?: ResetOtp;
  isVerified?: boolean;
  files: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const VerificationOtpSchema: Schema = new Schema(
  {
    otp: { type: String },
    isExpired: { type: Boolean, default: false },
    expireTime: { type: Date }
  },
  { _id: false }
);

const ResetOtpSchema: Schema = new Schema(
  {
    otp: { type: String },
    isExpired: { type: Boolean, default: false },
    expireTime: { type: Date }
  },
  { _id: false }
);

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    verification_otp: {
      type: VerificationOtpSchema,
      default: {}
    },

    resetOTP: {
      type: ResetOtpSchema,
      default: {}
    },

    access_code: {
      type: String
    },

    isVerified: { type: Boolean, default: false },

    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
      }
    ]
  },
  { timestamps: true }
);

// Hash password before saving
// UserSchema.pre<IUser>("save", async function (next: NextFunction) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

// // Compare password
// UserSchema.methods.comparePassword = async function (
//   password: string
// ): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };

export default mongoose.model<IUser>("User", UserSchema);
