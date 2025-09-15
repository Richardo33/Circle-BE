import express = require("express");
import authRouter from "./routes/auth/authRoutes";
import threadRouter from "./routes/thread/threadRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/thread", threadRouter);

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
