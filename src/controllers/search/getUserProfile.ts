import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        bio: true,
        photo_profile: true,
        backgroundPhoto: true,
        created_at: true,
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      data: {
        ...user,
        followers_count: user._count.followers,
        following_count: user._count.following,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
