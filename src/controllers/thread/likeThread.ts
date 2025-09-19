import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";

export const likeThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { threadId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized",
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: { thread_id: threadId, user_id: userId },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });

      const likeCount = await prisma.like.count({
        where: { thread_id: threadId },
      });

      return res.status(200).json({
        message: "Tweet unliked successfully",
        tweet_id: threadId,
        user_id: userId,
        liked: false,
        likes: likeCount,
      });
    } else {
      const like = await prisma.like.create({
        data: {
          thread_id: threadId,
          user_id: userId,
          created_by: userId,
        },
      });

      const likeCount = await prisma.like.count({
        where: { thread_id: threadId },
      });

      return res.status(200).json({
        message: "Tweet liked successfully",
        tweet_id: like.thread_id,
        user_id: like.user_id,
        liked: true,
        likes: likeCount,
      });
    }
  } catch (err) {
    next(err);
  }
};
