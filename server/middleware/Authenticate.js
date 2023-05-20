import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
const secret = process.env.SECRET;

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.tweetJWT;

  if (token) {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).send("Token expired");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).send("Unauthorized");
  }
};

export const postAuthorization = async (req, res, next) => {
  const postId = parseInt(req.params.id);
  let post;

  try {
    post = await prisma.post.findUnique({
      where: { id: postId },
      select: { author: { select: { id: true } } },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.author.id !== req.user.id) {
    return res
      .status(401)
      .send("Unauthorized: You are not the author of this post");
  }

  next();
};

export const commentAuthorization = async (req, res, next) => {
  const commentId = parseInt(req.params.id);
  let comment;

  try {
    comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { author: { select: { id: true } } },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }

  if (!comment) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (comment.author.id !== req.user.id) {
    return res
      .status(401)
      .send("Unauthorized: You are not the author of this comment");
  }

  next();
};
