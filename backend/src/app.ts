import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express, { Request, Response } from "express";
import connectDB from "./config/db";
import AuthRoute from "./routes/authRoutes";
import FileRoute from "./routes/fileRoutes";
import userRoute from "./routes/userRoutes";

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", AuthRoute)
app.use("/api/v1/file", FileRoute)
app.use("/api/v1/user", userRoute)
const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
