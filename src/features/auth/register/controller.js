import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAvatar } from "../../../utils/utils.js";
export const prisma = new PrismaClient();
export const registerController = async (req, res) => {
  const name = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const findEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (findEmail) {
    return res.status(403).send({
      success: false,
      data: [],
      message: "Email already exists",
      error: [],
    });
  }
  const generatedAvatar = generateAvatar();
  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      avatar: generatedAvatar,
    },
  });
  return res.send({
    success: true,
    data: createUser,
    message: "User registered successfully",
    error: [],
  });
};
