import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../connection/client";
import { signToken } from "../../utils/jwt";

type ValidationResult = {
  ok: boolean;
  value?: { identifier: string; password: string };
  details?: Record<string, string>;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRe = /^[a-zA-Z0-9_.]{3,30}$/;

function validateLoginPayload(req: Request): ValidationResult {
  if (!req.is("application/json")) {
    return {
      ok: false,
      details: { contentType: "Content-Type harus application/json" },
    };
  }

  const body = req.body as any;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, details: { body: "Body harus berupa objek JSON" } };
  }

  const errors: Record<string, string> = {};
  let { identifier, password } = body;

  if (typeof identifier !== "string") identifier = "";
  if (typeof password !== "string") password = "";

  identifier = identifier.trim();
  password = password.trim();

  if (!identifier) {
    errors.identifier = "identifier (email/username) wajib diisi";
  } else {
    const isEmail = emailRe.test(identifier);
    const isUsername = usernameRe.test(identifier);
    if (!isEmail && !isUsername) {
      errors.identifier =
        "Gunakan email yang valid atau username 3–30 karakter (alphanumeric/_/.)";
    }
  }

  if (!password) {
    errors.password = "password wajib diisi";
  } else if (password.length < 6) {
    errors.password = "password minimal 6 karakter";
  }

  if (Object.keys(errors).length) {
    return { ok: false, details: errors };
  }

  return { ok: true, value: { identifier, password } };
}

function sendValidationError(res: Response, details: Record<string, string>) {
  return res.status(400).json({
    code: 400,
    status: "error",
    error_code: "VALIDATION_ERROR",
    message: "Input tidak valid",
    details,
  });
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = validateLoginPayload(req);
    if (!validation.ok) {
      return sendValidationError(res, validation.details!);
    }
    const { identifier, password } = validation.value!;

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) {
      return res.status(401).json({
        code: 401,
        status: "error",
        error_code: "AUTH_INVALID_CREDENTIALS",
        message: "Email/Username atau password salah",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        status: "error",
        error_code: "AUTH_INVALID_CREDENTIALS",
        message: "Email/Username atau password salah",
      });
    }

    const token = signToken({ id: user.id, email: user.email });
    res.cookie("user_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Login berhasil.",
      data: {
        user_id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        avatar: user.photo_profile ?? null,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
