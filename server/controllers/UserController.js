import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateUser = async (req, res) => {
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
};

export const deleteUser = async (req, res) => {
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
};
