import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  otp?: string;
  access_code?:string;
  files: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
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

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    otp: {
      type: String
    },
    access_code:{
        type:String
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File"
      }
    ]
  },
  { timestamps: true }
);

//
// Hash password before saving
//
// UserSchema.pre<IUser>("save", async function (next:NextFunction) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

// //
// // Compare password
// //
// UserSchema.methods.comparePassword = async function (
//   password: string
// ): Promise<boolean> {
//   return bcrypt.compare(password, this.password);
// };

export default mongoose.model<IUser>("User", UserSchema);
