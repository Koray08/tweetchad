import express from "express";
const router = express.Router();

import {
  authenticateToken,
  postAuthorization,
} from "../middleware/Authenticate.js";

import {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostController.js";

router.use(authenticateToken);

router.get("/", getPosts);
router.get("/:id", getSinglePost);
router.post("/", createPost);
router.patch("/:id", postAuthorization, updatePost);
router.delete("/:id", postAuthorization, deletePost);

export default router;
