import { after } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

type NewAccount = { email: string; createdAt: Date };

/** Schedule only after a new account has committed successfully. */
export function notifyNewUser(user: NewAccount, method: "Google" | "Email/password") {
  if (process.env.SIGNUP_NOTIFICATIONS_ENABLED !== "true") return;

  // Neither scheduling nor mail delivery failures may reject a successful signup.
  try {
    after(async () => {
      try {
        const username = process.env.SMTP_USER;
        const password = process.env.SMTP_PASSWORD;
        if (!username || !password) {
          console.warn("[Signup notification] Missing SMTP credentials; notification skipped.");
          return;
        }
        const total = await prisma.user.count();
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtpout.secureserver.net",
          port: 465,
          secure: true,
          auth: { user: username, pass: password },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
          disableFileAccess: true,
          disableUrlAccess: true,
        });
        await transport.sendMail({
          from: { name: "Reziyume", address: username },
          to: "support@reziyume.com",
          subject: `New User Signed (${user.email.replace(/[\r\n]/g, "")})`,
          text: [
            "A new Reziyume account was created.",
            "",
            `Email: ${user.email}`,
            `Signup method: ${method}`,
            `Created at: ${user.createdAt.toISOString()}`,
            `Total registered users (including this account): ${total}`,
          ].join("\n"),
        });
      } catch {
        // SMTP errors can contain credentials or user data; do not log raw errors.
        console.error("[Signup notification] Delivery failed; account creation is unaffected.");
      }
    });
  } catch {
    console.error("[Signup notification] Scheduling failed; account creation is unaffected.");
  }
}
