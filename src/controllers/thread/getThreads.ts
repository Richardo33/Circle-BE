import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";

export const getThreads = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUserId = (req as any).user?.id || null;

    const threads = await prisma.thread.findMany({
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

    const formatted = threads.map((thread) => ({
      id: thread.id,
      content: thread.content,
      image: thread.image,
      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile,
      },
      created_at: thread.created_at,
      likes: thread.likes.length,
      reply: thread.replies.length,
      isLiked: currentUserId
        ? thread.likes.some((like) => like.user_id === currentUserId)
        : false,
    }));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data: {
        threads: formatted,
      },
    });
  } catch (err) {
    next(err);
  }
};
