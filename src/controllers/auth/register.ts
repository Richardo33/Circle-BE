import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../connection/client";
import { signToken } from "../../utils/jwt";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama lengkap, email, dan password wajib diisi" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo_profile = req.file
      ? `/uploads/profile/${req.file.filename}`
      : null;

    console.log(">>> req.file:", req.file);

    const username = email.split("@")[0];

    const user = await prisma.user.create({
      data: {
        username,
        full_name,
        email,
        password: hashedPassword,
        photo_profile,
      },
    });

    const token = signToken({ id: user.id, email: user.email });

    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    });

    return res.status(201).json({
      code: 200,
      status: "success",
      message: "Registrasi berhasil. Akun berhasil dibuat.",
      data: {
        user_id: user.id,
        name: user.full_name,
        email: user.email,
        photo_profile: user.photo_profile,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
