import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        bio: true,
        photo_profile: true,
        backgroundPhoto: true,
        created_at: true,
        threads: {
          select: {
            id: true,
            content: true,
            image: true,
            created_at: true,
          },
          orderBy: { created_at: "desc" },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.full_name,
        bio: user.bio,
        profile_picture: user.photo_profile,
        backgroundPhoto: user.backgroundPhoto,
        created_at: user.created_at,
        threads: user.threads.map((t) => ({
          id: t.id,
          content: t.content,
          image: t.image,
          created_at: t.created_at,
        })),
      },
    });
  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
