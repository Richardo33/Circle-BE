import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";
import { io } from "../../app";

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
      include: {
        user: true,
      },
    });

    io.emit("new-reply", {
      threadId,
      reply: {
        id: reply.id,
        content: reply.content,
        image: reply.image ? `http://localhost:3000${reply.image}` : null,
        created_at: reply.created_at,
        user: {
          id: reply.user.id,
          username: reply.user.username,
          name: reply.user.full_name,
          profile_picture: reply.user.photo_profile
            ? `http://localhost:3000${reply.user.photo_profile}`
            : null,
        },
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Reply berhasil diposting.",
      data: {
        reply: {
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
