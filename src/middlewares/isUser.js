import jwt from "jsonwebtoken";
import { prisma } from "../features/auth/register/controller.js";
export const isUser = async (req, res, next) => {
  const cookie = req.cookies.token;
  const decodedCookie = jwt.decode(cookie);
  if (!decodedCookie) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
      data: [],
      error: [],
    });
  }
  const userId = decodedCookie.userid;
  res.locals.userId = userId;
  const userToken = await prisma.token.findFirst({
    where: {
      userId,
    },
  });
  if (cookie == userToken.token) {
    next();
  } else {
    return res.status(401).send({
      success: false,
      message: "Unauthorized",
      data: [],
      error: [],
    });
  }
};
