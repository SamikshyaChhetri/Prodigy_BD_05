import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOtp } from "../../../utils/utils.js";
import { sendOTPcontroller } from "../../email/controller.js";
import { prisma } from "../register/controller.js";
export const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const findUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!findUser) {
    return res.status(404).send({
      success: false,
      data: [],
      message: "User not found",
      error: [],
    });
  }
  const comparePassword = await bcrypt.compare(password, findUser.password);
  if (!comparePassword) {
    return res.status(401).send({
      success: false,
      data: [],
      message: "Invalid password",
      error: [],
    });
  }
  if (comparePassword) {
    const token = jwt.sign(
      {
        userid: findUser.id,
      },
      "www"
    );
    res.cookie("token", token, {
      httpOnly: true, //yesle backend bata matra cookie access garna dinxa
    });
    const findToken = await prisma.token.findFirst({
      where: {
        userId: findUser.id,
      },
    });

    if (!findToken) {
      await prisma.token.create({
        data: {
          token,
          userId: findUser.id,
        },
      });
    } else {
      await prisma.token.update({
        where: { userId: findUser.id },
        data: {
          token,
        },
      });
    }
    return res.send({
      success: true,
      data: {
        token,
        user: findUser,
      },
      message: "User logged in successfully",
      error: [],
    });
  }
};

export const logoutController = async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(404).send({
      success: false,
      data: [],
      message: "Please provide a userId",
      error: [],
    });
  }
  prisma.token.delete({
    where: {
      userId,
    },
  });
  res.clearCookie("token");
  return res.status(200).send({
    success: true,
    data: [],
    message: "User logged out successfully",
    error: [],
  });
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        data: [],
        message: "User not found",
        error: [],
      });
    }

    //if the request doesnot contain otp create a otp and send to the user
    if (!otp) {
      const generatedOtp = generateOtp();
      const prevOtp = await prisma.otp.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!prevOtp) {
        await prisma.otp.create({
          data: {
            otp: generatedOtp,
            userId: user.id,
          },
        });
      } else {
        await prisma.otp.update({
          where: {
            id: prevOtp.id,
          },
          data: {
            otp: generatedOtp,
          },
        });
      }
      sendOTPcontroller(email, generatedOtp);

      return res.status(200).send({
        success: true,
        data: [],
        message: "Otp has been sent to your email",
        error: [],
      });
    } else {
      const otpfromDb = await prisma.otp.findFirst({
        where: {
          userId: user.id,
        },
      });
      if (!otpfromDb || otpfromDb.otp != otp) {
        return res.status(400).send({
          success: false,
          data: [],
          message: "OTP doesn't match",
          error: [],
        });
      }
      if (!req.body.password || !req.body.email) {
        return res.status(400).send({
          success: false,
          data: [],
          message: "please provide a email and password",
          error: [],
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      await prisma.otp.delete({
        where: {
          id: otpfromDb.id,
        },
      });
      return res.status(200).send({
        success: true,
        data: [],
        message: "Password changed successfully",
        error: [],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      data: [],
      message: "Internal Server Error",
      error,
    });
  }
};
