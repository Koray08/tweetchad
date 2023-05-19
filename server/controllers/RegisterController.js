import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const secret = process.env.SECRET;

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      },
    });

    const JWToken = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });
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
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
