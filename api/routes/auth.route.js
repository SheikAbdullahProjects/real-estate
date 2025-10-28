import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { signIn, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`, session: false  }),
  (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "14d",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      const {password :pwd, ...rest} = user
      const userString = encodeURIComponent(JSON.stringify(rest));
      res.redirect(
        `${process.env.CLIENT_URL}/auth-success?token=${token}&user=${userString}`
      );
    } catch (error) {
      console.error(error.message)
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)
    }
  }
);

export default router;
