import { Request, Response } from "express";

export const logout = (req: Request, res: Response) => {
  res.clearCookie("user_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Logout berhasil" });
};
