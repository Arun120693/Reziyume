import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { logger } from "./logger";
import { findOrCreateGoogleUser, getGoogleUserByEmail } from "@/services/auth/googleUserService";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "m@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const isVerified = (profile as { email_verified?: boolean })?.email_verified;
          if (!isVerified) {
            logger.warn("[Google Auth]", "Sign in rejected: Email not verified", { email: profile?.email || user?.email });
            return false;
          }

          const email = profile?.email || user?.email;
          if (!email) {
            logger.error("[Google Auth]", "Sign in rejected: No email provided", { profile, user });
            return false;
          }

          const name = profile?.name || user?.name;
          const image = profile?.image || user?.image;

          await findOrCreateGoogleUser({ email, name, image, emailVerified: isVerified });
          return true;
        } catch (error) {
          logger.error("[Google Auth]", "Sign in failed during user lookup/creation", error);
          // Return false or throw error. Throwing error allows NextAuth to show an error page, but returning false is also safe.
          // The prompt says "Throw meaningful errors instead of allowing generic OAuthCallback failures."
          throw new Error("Failed to process Google sign in. Please try again.");
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Prevent looping back to auth pages if no specific callbackUrl was provided
      if (url === `${baseUrl}/login` || url === `${baseUrl}/register`) {
        return `${baseUrl}/dashboard`;
      }
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          try {
            if (!user.email) {
              logger.error("[JWT]", "Google user missing email in JWT callback", { user });
              throw new Error("User email is missing");
            }
            const dbUser = await getGoogleUserByEmail(user.email);
            if (dbUser) {
              token.id = dbUser.id;
            } else {
               logger.warn("[JWT]", "Database user not found for Google login", { email: user.email });
            }
          } catch (error) {
             logger.error("[JWT]", "Error fetching Google user in JWT callback", error);
             throw new Error("Failed to fetch user data for session.");
          }
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-expect-error adding id to session.user
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
