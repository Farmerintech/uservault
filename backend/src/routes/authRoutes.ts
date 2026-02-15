import { Router } from "express";
import { createUser, loginUser, resendOtp, verifyOtp } from "../controllers/auth";

const AuthRoute = Router();

AuthRoute.post("/login", loginUser);
AuthRoute.post("/register", createUser)
AuthRoute.post("/verify-email", verifyOtp)
AuthRoute.post("/resend_otp", resendOtp)
export default AuthRoute