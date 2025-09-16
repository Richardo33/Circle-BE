import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";

export const createThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { content } = req.body;
    if (!content)
      return res.status(400).json({ message: "Content wajib diisi" });

    const image_url = req.file ? `/uploads/thread/${req.file.filename}` : null;

    const thread = await prisma.thread.create({
      data: {
        content,
        image: image_url,
        created_by: user.id,
      },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Thread berhasil diposting.",
      data: {
        tweet: {
          id: thread.id,
          user_id: thread.created_by,
          content: thread.content,
          image_url: thread.image,
          timestamp: thread.created_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
