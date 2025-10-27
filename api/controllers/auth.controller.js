import pool from "../db.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (password.length < 8) {
      return next(errorHandler(400, "Password must have length of 8"));
    }

    const [userexisting] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    if (userexisting.length > 0) {
      return next(errorHandler(409, "User already exists"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [user] = await pool.query(
      "INSERT INTO users(username, email, password) VALUES(?, ?, ?)",
      [username, email, hashedPassword]
    );
    res.status(201).json({
      success: true,
      user: {
        id: user.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};
