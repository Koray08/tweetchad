import express from "express";
const router = express.Router();

import { authenticateToken } from "../middleware/Authenticate.js";

import {
  getUserLikes,
  createPostLike,
  removePostLike,
} from "../controllers/LikeController.js";

router.use(authenticateToken);

router.get("/", getUserLikes);
router.post("/", createPostLike);
router.delete("/:postID", removePostLike);

export default router;
