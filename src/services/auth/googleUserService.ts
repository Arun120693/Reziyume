import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { logger } from "@/lib/logger";

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
      // Check again inside transaction to prevent race conditions
      const userInsideTx = await tx.user.findUnique({
        where: { email },
      });

      if (userInsideTx) {
        logger.info(LOG_PREFIX, "Existing user found via Google Auth (inside tx)", { email: userInsideTx.email });
        return userInsideTx;
      }

      const dummyPassword = randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(dummyPassword, 10);
      
      const createdUser = await tx.user.create({
        data: {
          email,
          passwordHash: hash,
        },
      });

      return createdUser;
    });

    logger.info(LOG_PREFIX, "New user created via Google Auth", { email: newUser.email });
    return newUser;
  } catch (error) {
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
