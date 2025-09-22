import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getThreadsUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ code: 401, status: "error", message: "Unauthorized" });
    }

    const threads = await prisma.thread.findMany({
      where: { created_by: userId },
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
      isLiked: thread.likes.some((like) => like.user_id === userId),
      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile ?? null,
      },
    }));

    return res
      .status(200)
      .json({ code: 200, status: "success", data: formattedThreads });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};
