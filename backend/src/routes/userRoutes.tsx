import { Router } from "express";
import { deleteUser, getUserByEmail, updateUser, resetAccessCode } from "../controllers/user";

const userRoute = Router();

userRoute.get("/get_user/:email", getUserByEmail)
.put("/edit_user/:email", updateUser)
.delete("/get_files/:email", deleteUser)
.put("/delete_file/:email", resetAccessCode)
export default userRoute