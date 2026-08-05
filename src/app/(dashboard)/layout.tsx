import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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

  return (
    <SidebarMainWrapper email={session.user?.email || ""}>
      {children}
    </SidebarMainWrapper>
  );
}
