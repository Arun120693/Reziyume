"use client";

import { createContext, useContext, ReactNode } from "react";

type PlanType = "FREE" | "PRO" | "PRO_MONTHLY" | "PRO_YEARLY";

interface UserContextValue {
  plan: PlanType;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  children,
  plan,
}: {
  children: ReactNode;
  plan: PlanType;
}) {
  return (
    <UserContext.Provider value={{ plan }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
