import dotenv from "dotenv";
dotenv.config();
import cors from "cors"
import express, { Request, Response } from "express";
import connectDB from "./config/db";
import AuthRoute from "./routes/authRoutes";
import FileRoute from "./routes/fileRoutes";
import userRoute from "./routes/userRoutes";

const app = express();


// Allow requests from specific origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://securevault.citadel-i.com.ng'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true, // If you need to allow cookies/auth headers
}));
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
