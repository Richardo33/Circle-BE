import { Request, Response } from "express";
import { prisma } from "../../connection/client";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { full_name, username, email, bio } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const dataUpdate: any = {};

    if (full_name !== undefined) dataUpdate.full_name = full_name;
    if (username !== undefined) dataUpdate.username = username;
    if (email !== undefined) dataUpdate.email = email;
    if (bio !== undefined) dataUpdate.bio = bio;

    if (req.files) {
      const files = req.files as {
        profileImage?: Express.Multer.File[];
        backgroundPhoto?: Express.Multer.File[];
      };

      if (files.profileImage && files.profileImage.length > 0) {
        dataUpdate.photo_profile = `/uploads/profile/${files.profileImage[0].filename}`;
      }

      if (files.backgroundPhoto && files.backgroundPhoto.length > 0) {
        dataUpdate.backgroundPhoto = `/uploads/background/${files.backgroundPhoto[0].filename}`;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataUpdate,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.full_name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profile_picture: updatedUser.photo_profile,
        backgroundPhoto: updatedUser.backgroundPhoto,
        created_at: updatedUser.created_at,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
