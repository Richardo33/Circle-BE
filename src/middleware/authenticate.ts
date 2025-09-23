import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../connection/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        full_name: string;
        photo_profile?: string | null;
        backgroundPhoto?: string | null;
        bio?: string | null;
      };
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.user_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized, token tidak ditemukan" });
  }

  try {
    const decoded = verifyToken(token) as { id: string; email: string };

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      photo_profile: user.photo_profile ?? null,
      backgroundPhoto: user.backgroundPhoto ?? null,
      bio: user.bio ?? null,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid atau expired" });
  }
}
