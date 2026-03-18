import { Router } from "express";
import { compareFaceController, createUser, deleteAllUsers, forgotPassword, loginUser, resendOtp, resetPassword, verifyOtp } from "../controllers/auth";
import { saveFace } from "../controllers/user";
import { imageUploader } from "../middlewares/imageUploader";

const AuthRoute = Router();

AuthRoute.post("/login", loginUser);
AuthRoute.post("/register", createUser)
AuthRoute.post("/verify-email", verifyOtp)
AuthRoute.post("/resend_otp", resendOtp)
AuthRoute.post("/forgot_password", forgotPassword)
AuthRoute.post("/reset_password", resetPassword)
AuthRoute.delete("/delete_users", deleteAllUsers);
AuthRoute.put("/save_face", saveFace)
AuthRoute.post("/compare_face", imageUploader.single("image"), compareFaceController )
export default AuthRoute