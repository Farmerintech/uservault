import { Router } from "express";
import { createFile, deleteFile, getFile, getUserFiles } from "../controllers/file";

const FileRoute = Router();

FileRoute.post("/create_file", createFile)
.get("/get_file", getFile)
.get("/get_files", getUserFiles)
.delete("/delete_file", deleteFile)
export default FileRoute