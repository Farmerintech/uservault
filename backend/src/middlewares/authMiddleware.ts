// middleware/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export interface AuthRequest extends Request {
  user?: any;
}
export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // Only allow full authentication
    if (decoded.authLevel !== 2) {
      return res.status(403).json({
        message: "Complete face verification",
      });
    }

    req.user = decoded; // if using custom typing

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};