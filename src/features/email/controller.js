import { createTransport } from "nodemailer";

export const sendOTPcontroller = (email, otp) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASS,
      },
    });

    transporter.sendMail({
      from: process.env.NODE_EMAIL,
      to: email,
      subject: "OTP for password reset",
      text: `This is your OTP to reset your account password : ${otp}`,
    });
  } catch (error) {
    console.log(error);
  }
};
