import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const secret = process.env.SECRET;
const prisma = new PrismaClient();
const app = express();

let myUser;

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const authenticateToken = (req, res, next) => {
  const token = req.cookies.tweetJWT;

  if (token) {
    jwt.verify(token, secret, (err, user) => {
      if (err) {
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

const postAuthorization = async (req, res, next) => {
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

app.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const myUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      },
    });

    const JWToken = jwt.sign({ id: myUser.id }, secret, { expiresIn: "1h" });
    res.cookie("tweetJWT", JWToken, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour
      secure: true, // HTTPS only
      sameSite: "strict", // CSRF protection
    });

    res.json({
      id: myUser.id,
      username: myUser.username,
      email: myUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  let users;
  try {
    users = await prisma.user.findMany();
  } catch (error) {
    console.error(error);
  }

  if (users) {
    myUser = users.find((user) => user.email == req.body.email);
  } else {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, myUser.password)) {
      const JWToken = jwt.sign({ id: myUser.id }, secret, { expiresIn: "1h" });
      res.cookie("tweetJWT", JWToken, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        secure: true, // HTTPS only
        sameSite: "strict", // CSRF protection
      });

      res.json({
        id: myUser.id,
        username: myUser.username,
        email: myUser.email,
      });
    } else {
      res.status(403).send("Wrong username/password combination!");
    }
  } catch (error) {
    res.status(500).send("User doesn't exist");
  }
});

app.get("/logout", authenticateToken, async (req, res) => {
  res.clearCookie("tweetJWT");
  res.send("Account deleted");
});

app.patch("/user/:username", authenticateToken, async (req, res) => {
  const id = req.user.id;
  const username = req.params.username;
  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
      },
    });

    res.send("success");
  } catch (error) {
    console.error(error);
  }
});

app.delete("/user", authenticateToken, async (req, res) => {
  const userID = req.user.id;

  try {
    await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    res.clearCookie("tweetJWT");
    res.send("Account deleted");
  } catch (error) {
    console.error(error);
  }
});

app.get("/post", authenticateToken, async (req, res) => {
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
});

app.post("/post", authenticateToken, async (req, res) => {
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
});

app.get("/post/:id", async (req, res) => {
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
});

app.delete(
  "/post/:id",
  authenticateToken,
  postAuthorization,
  async (req, res) => {
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
  }
);

app.patch(
  "/post/:id",
  authenticateToken,
  postAuthorization,
  async (req, res) => {
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
  }
);

app.get("/like/:id", authenticateToken, async (req, res) => {
  const currentUserID = req.params.id;
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
});

app.post("/like", authenticateToken, async (req, res) => {
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
});

app.delete("/like/:postID", authenticateToken, async (req, res) => {
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

    res.send("Post deleted");
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
