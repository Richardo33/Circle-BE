// middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.user_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, token tidak ditemukan" });
  }

  try {
    const decoded = verifyToken(token); // pastikan payload minimal {id, email}
    (req as any).user = decoded; // bisa juga pakai interface Express.Request yang diperluas
    next();
  } catch {
    return res.status(401).json({ message: "Token tidak valid atau expired" });
  }
}
