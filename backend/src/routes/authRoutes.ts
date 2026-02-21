import { Router } from "express";
import { createUser, deleteAllUsers, forgotPassword, loginUser, resendOtp, resetPassword, verifyOtp } from "../controllers/auth";

const AuthRoute = Router();

AuthRoute.post("/login", loginUser);
AuthRoute.post("/register", createUser)
AuthRoute.post("/verify-email", verifyOtp)
AuthRoute.post("/resend_otp", resendOtp)
AuthRoute.post("/forgot_password", forgotPassword)
AuthRoute.post("/reset_password", resetPassword)
AuthRoute.delete("/delete_users", deleteAllUsers)
export default AuthRoute