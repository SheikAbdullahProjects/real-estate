import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import pool from "../db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;
        const avatar = profile.photos?.[0]?.value

        const [existingUser] = await pool.query(
          "SELECT * FROM users WHERE googleId = ? OR email = ?",
          [googleId, email]
        );

        let user;
        if (existingUser.length > 0) {
          user = existingUser[0];
        } else {
          const [newUser] = await pool.query(
            "INSERT INTO users (username, email, googleId, avatar) VALUES (?, ?, ?, ?)",
            [username, email, googleId, avatar]
          );
          const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
            newUser.insertId,
          ]);
          user = rows[0];
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);



export default passport;
