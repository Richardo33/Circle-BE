import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";
import { Prisma } from "@prisma/client";

const threadWithRelations = Prisma.validator<Prisma.ThreadInclude>()({
  user: {
    select: {
      id: true,
      username: true,
      full_name: true,
      photo_profile: true,
    },
  },
  replies: {
    include: {
      user: {
        select: {
          id: true,
          username: true,
          full_name: true,
          photo_profile: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  },
  likes: {
    select: {
      user_id: true,
    },
  },
});

type ThreadWithRelations = Prisma.ThreadGetPayload<{
  include: typeof threadWithRelations;
}>;

export const getThreadById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const thread: ThreadWithRelations | null = await prisma.thread.findUnique({
      where: { id },
      include: threadWithRelations,
    });

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    // cek apakah user sudah like
    const isLiked =
      req.user && thread.likes.some((like) => like.user_id === req.user!.id);

    const threadData = {
      id: thread.id,
      content: thread.content,
      image: thread.image,
      created_at: thread.created_at,
      user: {
        id: thread.user.id,
        username: thread.user.username,
        name: thread.user.full_name,
        profile_picture: thread.user.photo_profile,
      },
      likes: thread.likes.length,
      reply: thread.replies.length,
      isLiked: isLiked,
      replies: thread.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        image: reply.image,
        created_at: reply.created_at,
        user: {
          id: reply.user.id,
          username: reply.user.username,
          name: reply.user.full_name,
          profile_picture: reply.user.photo_profile,
        },
      })),
    };

    return res.status(200).json({
      code: 200,
      status: "success",
      data: { thread: threadData },
    });
  } catch (err) {
    next(err);
  }
};
