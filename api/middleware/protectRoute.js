import jwt from "jsonwebtoken";
import pool from "../db.js";


const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.access_token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    // Find the user in the database
    const [userResult] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [decoded.id]
    );

    if (userResult.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to request object (for downstream use)
    const { password, ...user } = userResult[0];
    req.user = user;

    // Continue to next middleware/route
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default protectRoute;
