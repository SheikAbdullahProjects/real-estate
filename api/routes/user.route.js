import express from "express";
import { updateProfileImage } from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.put("/profile-image", upload.single("file"), protectRoute, updateProfileImage);

export default router;