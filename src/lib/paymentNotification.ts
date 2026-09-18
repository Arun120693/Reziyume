import { after } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export function notifyProPayment(input: { userId: string; email: string; externalId: string; amountMinor: number; currency: string; provider: string }) {
  if (process.env.SIGNUP_NOTIFICATIONS_ENABLED !== "true") return;
  try {
    after(async () => {
      try {
        const username = process.env.SMTP_USER;
        const password = process.env.SMTP_PASSWORD;
        if (!username || !password) return;
        const total = await prisma.paymentTransaction.aggregate({ where: { currency: input.currency.toUpperCase() }, _count: { _all: true }, _sum: { amountMinor: true } });
        const transactions = await prisma.paymentTransaction.count();
        const users = await prisma.paymentTransaction.groupBy({ by: ["userId"] });
        const amount = (input.amountMinor / 100).toFixed(2);
        const totalPaid = ((total._sum.amountMinor || 0) / 100).toFixed(2);
        const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtpout.secureserver.net", port: 465, secure: true, auth: { user: username, pass: password }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, disableFileAccess: true, disableUrlAccess: true });
        await transport.sendMail({
          from: { name: "Reziyume", address: username }, to: "support@reziyume.com",
          subject: `${input.email} - Subscribed for Pro plan`,
          text: [`A Pro plan payment was completed.`, ``, `User email: ${input.email}`, `Provider: ${input.provider}`, `Current payment: ${input.currency} ${amount}`, `Paying users recorded so far: ${users.length}`, `Successful transactions recorded so far (including this payment): ${transactions}`, `Total paid recorded in ${input.currency}: ${totalPaid}`, `Totals cover payments recorded since transaction tracking was enabled; currencies are counted separately.`].join("\n"),
        });
      } catch { console.error("[Payment notification] Delivery failed; payment is unaffected."); }
    });
  } catch { console.error("[Payment notification] Scheduling failed; payment is unaffected."); }
}
