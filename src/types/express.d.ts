import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        full_name: string;
        photo_profile?: string | null;
        backgroundPhoto?: string | null;
        bio?: string | null;
      };
    }
  }
}
