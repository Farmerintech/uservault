import { Router } from "express";
import { createUser, loginUser, verifyOtp } from "../controllers/auth";

const AuthRoute = Router();

AuthRoute.post("/login", loginUser);
AuthRoute.post("/register", createUser)
AuthRoute.post("/verify-email", verifyOtp)
export default AuthRoute