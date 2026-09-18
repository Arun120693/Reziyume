import prisma from "./prisma";
import { notifyProPayment } from "./paymentNotification";
export async function recordPayment(input: { userId: string; provider: "Stripe" | "Razorpay"; externalId: string; amountMinor: number; currency: string; subscriptionId: string; expiresAt: Date }) {
  if (!Number.isSafeInteger(input.amountMinor) || input.amountMinor <= 0 || !Number.isFinite(input.expiresAt.getTime())) throw new Error("Invalid captured payment");
  const result = await prisma.$transaction(async tx => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: input.userId } });
    const inserted = await tx.paymentTransaction.createMany({ data: [{ userId: user.id, provider: input.provider, externalId: input.externalId, amountMinor: input.amountMinor, currency: input.currency.toUpperCase() }], skipDuplicates: true });
    if (!inserted.count) return null;
    await tx.user.update({ where: { id: user.id }, data: {
      plan: "PRO", planExpiresAt: user.planExpiresAt && user.planExpiresAt > input.expiresAt ? user.planExpiresAt : input.expiresAt,
      ...(input.provider === "Stripe" ? { stripeSubscriptionId: input.subscriptionId } : { razorpaySubscriptionId: input.subscriptionId }),
      ...(user.plan === "FREE" ? { monthlyParseCount: 0 } : {}),
    } });
    return user;
  });
  if (result) notifyProPayment({ ...input, email: result.email });
  return !!result;
}
