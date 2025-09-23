import { Request, Response } from "express";
import { prisma } from "../../connection/client";

interface AuthenticatedRequest extends Request {
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

export const searchUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { keyword } = req.query;
    const loggedInUserId = req.user?.id;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Keyword is required",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: keyword, mode: "insensitive" } },
          { full_name: { contains: keyword, mode: "insensitive" } },
        ],
        NOT: { id: loggedInUserId },
      },
      select: {
        id: true,
        username: true,
        full_name: true,
        photo_profile: true,
      },
      take: 20,
    });

    const usersWithFollow = await Promise.all(
      users.map(async (user) => {
        const follow = await prisma.following.findFirst({
          where: {
            follower_id: loggedInUserId,
            following_id: user.id,
          },
        });

        return {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          profile_picture: user.photo_profile,
          isFollowing: !!follow,
        };
      })
    );

    return res.status(200).json({
      code: 200,
      status: "success",
      data: usersWithFollow,
    });
  } catch (err) {
    console.error("Error searching users:", err);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};
