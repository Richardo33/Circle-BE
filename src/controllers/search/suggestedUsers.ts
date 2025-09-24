import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    photo_profile?: string | null;
    backgroundPhoto?: string | null;
    bio?: string | null;
  };
}

export const getSuggestedUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const followed = await prisma.following.findMany({
      where: { follower_id: userId },
      select: { following_id: true },
    });
    const followedIds = followed.map((f) => f.following_id);

    const allUsers = await prisma.user.findMany({
      where: {
        id: { notIn: [...followedIds, userId] },
      },
      select: {
        id: true,
        full_name: true,
        username: true,
        photo_profile: true,
      },
    });

    const shuffledUsers = allUsers.sort(() => Math.random() - 0.5);

    const suggested = shuffledUsers.slice(0, 3);

    res.status(200).json({ data: suggested });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
