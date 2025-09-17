import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRouter from "./routes/auth/authRoutes";
import threadRouter from "./routes/thread/threadRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

// Middleware
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

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/thread", threadRouter);

// Buat HTTP server dari Express app
const server = createServer(app);

// Init socket.io
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
  console.log(`Server running on port ${PORT}`);
});
