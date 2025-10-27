import pool from "../db.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
    const [userexisting] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (userexisting.length === 0) {
      return next(errorHandler(404, "User not found"));
    }
    const isMatch = await bcrypt.compare(password, userexisting[0].password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    const token = jwt.sign({ id: userexisting[0].id }, process.env.SECRET_KEY, {
      expiresIn: "14d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const { password: pwd, ...user } = userexisting[0];
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
