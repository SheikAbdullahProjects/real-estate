import cloudinary from "../config/cloudinary.js";
import pool from "../db.js";

export const updateProfileImage = async (req, res, next) => {
  try {
    const image = req.file;
    const userId = req.user.id;
    // Check if user exists
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user[0].avatar) {
      // Optionally, delete the previous image from Cloudinary here
      try {
        const parts = user[0].avatar.split("/");
        const publicIdWithExt = parts
          .slice(parts.indexOf("upload") + 2)
          .join("/");
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log(error);
      }
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(image.path, {
      folder: "profile_images",
      width: 500,
      height: 500,
      crop: "fill",
    });
    // Update user's avatar URL in the database
    await pool.query("UPDATE users SET avatar = ? WHERE id = ?", [
      result.secure_url,
      userId,
    ]);
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      avatar: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
