import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  otp?: string;
  access_code?:string;
  resetOTPExpire?:any;
  resetOTP?:string;
  isVerified?:boolean;
  files: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

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
    resetOTPExpire:{
      type:String
    },
    resetOTP:{
      type:String
},
    otp: {
      type: String
    },
    access_code:{
        type:String
    },
    isVerified:{type:Boolean, default:false},
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
