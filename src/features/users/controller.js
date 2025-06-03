import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const userController = async (req, res) => {
  const alluser = await prisma.user.findMany();
  res.send(alluser);
};
export const singleUserController = async (req, res) => {
  const userData = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });
  if (!userData) {
    return res.status(404).send({
      success: false,
      data: [],
      message: "User not found",
      error: ["User not found"],
    });
  }
  return res.status(200).send({
    success: true,
    data: userData,
    message: "User retrieved",
    error: [],
  });
};
