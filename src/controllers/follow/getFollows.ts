import { Request, Response } from "express";
import { prisma } from "../../connection/client";

interface AuthRequest extends Request {
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

export const getFollows = async (req: AuthRequest, res: Response) => {
  try {
    const type = req.query.type as string;
    const userId = req.user?.id;

    if (!userId || !type) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Missing type query parameter",
      });
    }

    if (type === "followers") {
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

      const followersWithIsFollowing = await Promise.all(
        followers.map(async (f) => {
          const followBack = await prisma.following.findUnique({
            where: {
              follower_id_following_id: {
                follower_id: userId,
                following_id: f.follower.id,
              },
            },
          });

          return {
            id: f.follower.id,
            username: f.follower.username,
            full_name: f.follower.full_name,
            profile_picture: f.follower.photo_profile ?? null,
            isFollowing: !!followBack,
          };
        })
      );

      return res.status(200).json({
        code: 200,
        status: "success",
        data: followersWithIsFollowing,
      });
    } else if (type === "following") {
      const following = await prisma.following.findMany({
        where: { follower_id: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      });

      const followingWithFlag = following.map((f) => ({
        id: f.following.id,
        username: f.following.username,
        full_name: f.following.full_name,
        profile_picture: f.following.photo_profile ?? null,
        isFollowing: true,
      }));

      return res.status(200).json({
        code: 200,
        status: "success",
        data: followingWithFlag,
      });
    } else {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Invalid type query parameter",
      });
    }
  } catch (err) {
    console.error("Error getFollows:", err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { targetId } = req.body;

    if (!userId || !targetId) {
      return res.status(400).json({ code: 400, message: "Missing user Id" });
    }

    const existing = await prisma.following.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: targetId,
        },
      },
    });

    if (existing) {
      await prisma.following.delete({
        where: {
          follower_id_following_id: {
            follower_id: userId,
            following_id: targetId,
          },
        },
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Unfollowed successfully",
      });
    } else {
      await prisma.following.create({
        data: { follower_id: userId, following_id: targetId },
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "Followed successfully",
      });
    }
  } catch (err) {
    console.error("Error followUser:", err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};

export const getFollowsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const type = req.query.type as string;

    if (!userId || !type) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Missing userId or type query parameter",
      });
    }

    if (type === "followers") {
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

      const followersFormatted = followers.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        full_name: f.follower.full_name,
        profile_picture: f.follower.photo_profile ?? null,
      }));

      return res.status(200).json({
        code: 200,
        status: "success",
        data: followersFormatted,
      });
    }

    if (type === "following") {
      const following = await prisma.following.findMany({
        where: { follower_id: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              full_name: true,
              photo_profile: true,
            },
          },
        },
      });

      const followingFormatted = following.map((f) => ({
        id: f.following.id,
        username: f.following.username,
        full_name: f.following.full_name,
        profile_picture: f.following.photo_profile ?? null,
      }));

      return res.status(200).json({
        code: 200,
        status: "success",
        data: followingFormatted,
      });
    }

    return res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid type query parameter",
    });
  } catch (err) {
    console.error("Error getFollowsByUserId:", err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};
