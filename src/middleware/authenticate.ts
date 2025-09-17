// middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../connection/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username?: string;
        full_name: string;
        avatar?: string | null;
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
    // decode token untuk dapat user id
    const decoded = verifyToken(token) as { id: string; email: string };

    // ambil user lengkap dari database
    prisma.user
      .findUnique({ where: { id: decoded.id } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "User tidak ditemukan" });
        }

        // assign lengkap ke req.user
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username || undefined,
          full_name: user.full_name,
          avatar: user.photo_profile || null,
        };

        next();
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      });
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau expired" });
  }
}
