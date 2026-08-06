import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserProvider } from "@/lib/context/UserContext";

import { SidebarMainWrapper } from "./SidebarMainWrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  let plan: "FREE" | "PRO" | "PRO_MONTHLY" | "PRO_YEARLY" = "FREE";
  if (session.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { plan: true },
    });
    if (dbUser?.plan) {
      plan = dbUser.plan as "FREE" | "PRO" | "PRO_MONTHLY" | "PRO_YEARLY";
    }
  }

  return (
    <UserProvider plan={plan}>
      <SidebarMainWrapper email={session.user?.email || ""}>
        {children}
      </SidebarMainWrapper>
    </UserProvider>
  );
}
