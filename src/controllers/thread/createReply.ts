import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";

export const createReply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized",
      });
    }

    const imagePath = req.file ? `/uploads/reply/${req.file.filename}` : null;

    if ((!content || content.trim() === "") && !imagePath) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: "Invalid Thread content",
      });
    }

    const reply = await prisma.reply.create({
      data: {
        user_id: userId,
        thread_id: threadId,
        content,
        image: imagePath,
        created_by: userId,
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "reply berhasil diposting.",
      data: {
        tweet: {
          id: reply.id,
          user_id: reply.user_id,

          content: reply.content,
          image_url: reply.image ? `http://localhost:3000${reply.image}` : null,
          timestamp: reply.created_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
