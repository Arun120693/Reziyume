import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { logger } from "@/lib/logger";
import { notifyNewUser } from "@/lib/newUserNotification";

const LOG_PREFIX = "[Google Auth]";

interface GoogleUserParams {
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: boolean;
}

export async function findOrCreateGoogleUser(params: GoogleUserParams) {
  try {
    const { email } = params;

    if (!email) {
      logger.error(LOG_PREFIX, "Missing email in Google profile", params);
      throw new Error("Missing email in Google profile");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.info(LOG_PREFIX, "Existing user found via Google Auth", { email: existingUser.email });
      return existingUser;
    }

    // New user - run in transaction
    const newUser = await prisma.$transaction(async (tx) => {
      // Another request may have created this account since the first lookup.
      const userInsideTx = await tx.user.findUnique({
        where: { email },
      });

      if (userInsideTx) {
        logger.info(LOG_PREFIX, "Existing user found via Google Auth (inside tx)", { email: userInsideTx.email });
        return { user: userInsideTx, created: false };
      }

      const dummyPassword = randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(dummyPassword, 10);
      
      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash: hash,
        },
      });

      return { user: createdUser, created: true };
    }, {
      maxWait: 10000,
      timeout: 10000,
    });

    if (newUser.created) {
      notifyNewUser(newUser.user, "Google");
      logger.info(LOG_PREFIX, "New user created via Google Auth", { email: newUser.user.email });
    }
    return newUser.user;
  } catch (error) {
    // A concurrent signup can win the unique-email insert. It owns the notification.
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      const existing = await prisma.user.findUnique({ where: { email: params.email } });
      if (existing) return existing;
    }
    logger.error(LOG_PREFIX, "Error in findOrCreateGoogleUser", error);
    throw error;
  }
}

export async function getGoogleUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      logger.warn(LOG_PREFIX, "User not found by email in getGoogleUserByEmail", { email });
    }
    
    return user;
  } catch (error) {
    logger.error(LOG_PREFIX, "Error fetching user by email", error);
    throw error;
  }
}
