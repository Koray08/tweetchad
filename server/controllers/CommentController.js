import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getComments = async (req, res) => {
  const postID = parseInt(req.params.id);
  try {
    const postComments = await prisma.comment.findMany({
      where: {
        postId: postID,
      },
      include: {
        author: true,
      },
    });

    res.send(postComments);
  } catch (error) {
    console.error(error);
  }
};

export const createComment = async (req, res) => {
  try {
    const userID = req.user.id;
    const postID = req.body.postID;
    const content = req.body.content;

    const like = await prisma.comment.create({
      data: {
        author: { connect: { id: userID } },
        post: { connect: { id: postID } },
        content: content,
      },
      include: {
        author: true,
      },
    });

    res.json(like);
  } catch (error) {
    console.error(error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userID = req.user.id;
    const commentID = parseInt(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentID,
      },
    });

    if (!comment) {
      return res.sendStatus(404);
    }

    if (comment.authorId !== userID) {
      return res.sendStatus(403);
    }

    const removedComment = await prisma.comment.delete({
      where: {
        id: commentID,
      },
    });

    res.json(removedComment);
  } catch (error) {
    console.error(error);
  }
};
