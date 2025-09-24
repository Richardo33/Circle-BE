import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getThreadsByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Username is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
      });
    }

    const threads = await prisma.thread.findMany({
      where: { created_by: user.id },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            full_name: true,
            photo_profile: true,
          },
        },
        replies: true,
        likes: true,
      },
    });

    const formattedThreads = threads.map((thread) => ({
      id: thread.id,
      content: thread.content,
      image: thread.image ?? null,
      created_at: thread.created_at,
      likes: thread.likes.length,
      reply: thread.replies.length,
      isLiked: thread.likes.some(
        (like) => like.user_id === (req as any).user?.id
      ),
      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile ?? null,
      },
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      postCount: formattedThreads.length,
      data: formattedThreads,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};
