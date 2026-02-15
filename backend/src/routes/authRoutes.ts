import { Router } from "express";
import { createUser, loginUser } from "../controllers/auth";

const AuthRoute = Router();

AuthRoute.post("/login", loginUser);
AuthRoute.post("/register", createUser)

export default AuthRoute