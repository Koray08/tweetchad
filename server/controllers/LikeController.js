import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserLikes = async (req, res) => {
  const currentUserID = req.user.id;
  try {
    const currentUserLikes = await prisma.like.findMany({
      where: {
        userId: currentUserID,
      },
    });

    res.send(currentUserLikes);
  } catch (error) {
    console.error(error);
  }
};

export const createPostLike = async (req, res) => {
  try {
    const userID = req.user.id;
    const postID = req.body.postID;

    const like = await prisma.like.create({
      data: {
        user: { connect: { id: userID } },
        post: { connect: { id: postID } },
      },
    });

    res.json(like);
  } catch (error) {
    console.error(error);
  }
};

export const removePostLike = async (req, res) => {
  try {
    const userID = req.user.id;
    const postID = req.params.postID;

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userID,
          postId: parseInt(postID),
        },
      },
    });

    const likeID = like.id;

    await prisma.like.delete({
      where: {
        id: likeID,
      },
    });

    res.send("Like removed");
  } catch (error) {
    console.error(error);
  }
};
