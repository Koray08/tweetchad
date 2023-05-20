import express from "express";
const router = express.Router();

import { authenticateToken } from "../middleware/Authenticate.js";

import {
  getComments,
  createComment,
  deleteComment,
} from "../controllers/CommentController.js";

router.use(authenticateToken);

router.get("/:id", getComments);
router.post("/", createComment);
router.delete("/:id", deleteComment);

export default router;
