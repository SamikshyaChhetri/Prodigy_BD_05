import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import loginrouter from "./src/features/auth/login/routes.js";
import registerRouter from "./src/features/auth/register/route.js";
import listRouter from "./src/features/listing/route.js";
import reservationRouter from "./src/features/reserve/route.js";
import reviewRouter from "./src/features/review/route.js";
import userRouter from "./src/features/users/route.js";
const app = express();
app.use(express.json()); //api bata aako string ko form ma vako json lai usable json ma parse garxa(req.body ma dinxa)
app.use(cookieParser()); //cookie handle garxa(req.cookies ma dinxa)
dotenv.config(); //env variable lai configure garxa . env var lai use garna allow garxa
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
); //frontend bata pathako attachment lai parse garera usable form ma dinxa(req.files ma dinxa)

app.use(cors({ origin: true, credentials: true })); //kun kun domain bata aako req accept garne vanera specify garxa. Credential true le chai cookies haru ni accept garna dinxa
app.use("/auth", registerRouter);
app.use("/users", userRouter);
app.use("/auth", loginrouter);
app.use("/listing", listRouter);
app.use("/review", reviewRouter);
app.use("/reserve", reservationRouter);
app.get("/", (req, res) => {
  res.send("I am alive");
}); //backend chalexa ki naai check garxa
app.listen(3333, () => {
  console.log("Server is running at 3333 port");
}); //rakheko port ma backend run garxa
