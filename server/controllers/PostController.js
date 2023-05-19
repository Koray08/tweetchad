import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (req, res) => {
  const { skip = 0, take = 3 } = req.query;
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
  }
};

export const getSinglePost = async (req, res) => {
  const currentPostID = req.params.id;

  try {
    const likes = await prisma.like.findMany({
      where: {
        postId: parseInt(currentPostID),
      },
      include: {
        user: true,
      },
    });

    res.json(likes);
  } catch (error) {
    console.error(error);
  }
};

export const createPost = async (req, res) => {
  const userID = req.user.id;
  const content = req.body.content;

  try {
    const post = await prisma.post.create({
      data: {
        content: content,
        author: { connect: { id: userID } },
      },
      include: {
        author: true,
      },
    });

    res.send(post);
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const content = req.body.content;

  try {
    await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        content: content,
      },
    });

    res.send("success");
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postID = req.params.id;

    await prisma.post.delete({
      where: {
        id: parseInt(postID),
      },
    });

    res.send("Post deleted");
  } catch (error) {
    console.error(error);
  }
};
