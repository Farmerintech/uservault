import { Router } from "express";
import { deleteUser, getUserByEmail, updateUser, resetAccessCode, saveFace } from "../controllers/user";
import { authMiddleWare } from "../middlewares/authMiddleware";
import { compareFaceController } from "../controllers/auth";

const userRoute = Router();

userRoute.get("/get_user/:email", authMiddleWare, getUserByEmail)
.put("/edit_user/:email", authMiddleWare, updateUser)
.delete("/get_user/:email", authMiddleWare, deleteUser)
.put("/delete_user/:email", authMiddleWare, resetAccessCode)

export default userRoute