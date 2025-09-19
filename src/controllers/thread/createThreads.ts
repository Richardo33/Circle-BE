import { Request, Response, NextFunction } from "express";
import { prisma } from "../../connection/client";
import { io } from "../../app";

export const createThread = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { content } = req.body;

    if (!content && !req.file) {
      return res
        .status(400)
        .json({ message: "Content atau image wajib diisi" });
    }

    const image_url = req.file ? `/uploads/thread/${req.file.filename}` : null;

    const thread = await prisma.thread.create({
      data: {
        content: content || "",
        image: image_url,
        created_by: user.id,
      },
    });

    const threadData = {
      id: thread.id,
      content: thread.content,
      image: image_url,
      user: {
        id: user.id,
        username: user.username ?? "anonymous",
        name: user.full_name,
        profile_picture: user.avatar ?? null,
      },
      created_at: thread.created_at,
      likes: 0,
      reply: 0,
      isLiked: false,
    };

    io.emit("new-thread", threadData);

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Thread berhasil diposting.",
      data: { tweet: threadData },
    });
  } catch (err) {
    next(err);
  }
};
