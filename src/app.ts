import express, { Request, Response, NextFunction } from "express";
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

function sendError(
  res: Response,
  status: number,
  error_code: string,
  message: string,
  details?: Record<string, string>
) {
  return res.status(status).json({
    code: status,
    status: "error",
    error_code,
    message,
    ...(details ? { details } : {}),
  });
}

app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return sendError(res, 400, "INVALID_JSON", "Body JSON tidak valid");
  }
  next(err);
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1", (req: Request, res: Response, next: NextFunction) => {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "DELETE") return next();

  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) return next();

  if (!contentType.includes("application/json")) {
    return sendError(
      res,
      400,
      "CONTENT_TYPE_REQUIRED",
      "Content-Type harus application/json"
    );
  }

  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/thread", threadRouter);
app.use("/api/v1/reply", replyRoutes);
app.use("/api/v1/like", likeRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/search", searcRoutes);

setupSwagger(app);

app.use("/api/v1", (req: Request, res: Response) => {
  return sendError(res, 404, "NOT_FOUND", "Endpoint tidak ditemukan");
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(err);

  if (err && err.status === 400) {
    return sendError(
      res,
      400,
      err.error_code || "VALIDATION_ERROR",
      err.message || "Input tidak valid",
      err.details
    );
  }

  if (err && err.status === 401) {
    return sendError(
      res,
      401,
      err.error_code || "AUTH_INVALID_CREDENTIALS",
      err.message || "Email/Username atau password salah"
    );
  }

  return sendError(
    res,
    500,
    "INTERNAL_SERVER_ERROR",
    "Terjadi kesalahan pada server"
  );
});

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
