import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth/authRoutes";
import threadRouter from "./routes/thread/threadRoutes";
import replyRoutes from "./routes/reply/replyRoutes";
import likeRoutes from "./routes/like/likeRoutes";
import followRoutes from "./routes/follow/followRoutes";
import searcRoutes from "./routes/search/searchRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { setupSwagger } from "./server/swagger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/thread", threadRouter);
app.use("/api/v1/reply", replyRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/search", searcRoutes);

setupSwagger(app);

const server = createServer(app);

export const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running`);
});
