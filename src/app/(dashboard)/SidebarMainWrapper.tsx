"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarMainWrapper({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.includes("/studio/");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
      {/* Left Sidebar — uses the fully styled Sidebar component */}
      <Sidebar email={email} />

      {/* Main content */}
      <main className="flex-1 ml-[260px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
