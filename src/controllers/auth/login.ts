import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../connection/client";
import { signToken } from "../../utils/jwt";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = signToken({ id: user.id, email: user.email });

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile ?? null,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
