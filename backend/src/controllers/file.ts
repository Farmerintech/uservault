import { Request, Response } from "express";
import crypto from "crypto";
import fileModel from "../models/file";
import users from "../models/users";

/* =========================================
   1️⃣ CREATE FILE
========================================= */
export const createFile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { fileType, filePath } = req.body;

    // Generate unique hash code for file
    const hashCode = crypto.randomBytes(16).toString("hex");

    const newFile = await fileModel.create({
      user: userId,
      fileType,
      filePath,
      hashCode
    });

    res.status(201).json({
      message: "File created successfully",
      file: newFile
    });
    return
  } catch (error) {
    res.status(500).json({ message: "Error creating file", error });
    return
  }
};

/* =========================================
   2️⃣ DELETE FILE
========================================= */
export const deleteFile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;

    const file = await fileModel.findOneAndDelete({
      _id: fileId,
      user: userId
    });

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return 
    }

    res.status(200).json({ message: "File deleted successfully" });
    return
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
    return
  }
};

/* =========================================
   3️⃣ RETRIEVE SINGLE FILE (WITH SECRET CODE)
========================================= */
export const getFile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { fileId } = req.params;
    const { access_code } = req.body;

    const user = await users.findById(userId);

    if (!user || user.access_code !== access_code) {
       res.status(403).json({ message: "Invalid secret code" });
       return
    }

    const file = await fileModel.findOne({
      _id: fileId,
      user: userId
    });

    if (!file) {
       res.status(404).json({ message: "File not found" });
       return
    }

    res.status(200).json({ file });
    return
  } catch (error) {
    res.status(500).json({ message: "Error retrieving file", error });
    return
  }
};

/* =========================================
   4️⃣ RETRIEVE ALL USER FILES (WITH SECRET CODE)
========================================= */
export const getUserFiles = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { access_code } = req.body;

    const user = await users.findById(userId);

    if (!user || user.access_code !== access_code) {
       res.status(403).json({ message: "Invalid secret code" });
       return
    }

    const files = await fileModel.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: files.length,
      files
    });
    return
  } catch (error) {
    res.status(500).json({ message: "Error retrieving files", error });
    return
  }
};