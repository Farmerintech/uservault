import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleWare = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    /* ---------- GET TOKEN ---------- */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
      return;
    }

    /* ---------- VERIFY TOKEN ---------- */
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, invalid token",
    });
  }
};
