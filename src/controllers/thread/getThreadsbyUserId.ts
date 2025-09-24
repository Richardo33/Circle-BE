import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const getThreadsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const threads = await prisma.thread.findMany({
      where: { created_by: userId },
      include: {
        replies: true,
        likes: true,
      },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      data: threads,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal Server Error" });
  }
};
