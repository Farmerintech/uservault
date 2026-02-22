import { Router } from "express";
import { createFile, deleteFile, getFile, getUserFiles } from "../controllers/file";
import { authMiddleWare } from "../middlewares/authMiddleware";

const FileRoute = Router();

FileRoute.post("/create_file", authMiddleWare, createFile)
.get("/get_file", authMiddleWare, getFile)
.get("/get_files", authMiddleWare, getUserFiles)
.delete("/delete_file", authMiddleWare, deleteFile)
export default FileRoute