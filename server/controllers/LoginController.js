import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const secret = process.env.SECRET;

export const login = async (req, res) => {
  let user;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
  } catch (error) {
    res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const JWToken = jwt.sign({ id: user.id }, secret, {
        expiresIn: "1h",
      });
      res.cookie("tweetJWT", JWToken, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        secure: true, // HTTPS only
        sameSite: "strict", // CSRF protection
      });

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(403).send("Wrong username/password combination!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("User doesn't exist");
  }
};
