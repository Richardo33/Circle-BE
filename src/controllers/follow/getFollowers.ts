import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const followers = await prisma.following.findMany({
      where: { following_id: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      data: followers.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        full_name: f.follower.full_name,
        profile_picture: f.follower.photo_profile ?? null,
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};
