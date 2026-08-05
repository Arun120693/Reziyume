"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";

interface CreateResumeButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

export function CreateResumeButton({ className, variant = "primary", children }: CreateResumeButtonProps) {
  const router = useRouter();
  const [isLoading] = useState(false);

  const handleCreate = () => {
    router.push("/dashboard/templates");
  };

  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-slate-700 bg-white border-slate-300 hover:bg-slate-50 focus:ring-slate-500"
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isLoading}
      className={`${baseStyles} ${variants[variant]} ${className || ""}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Plus className="h-4 w-4 mr-2" />
      )}
      {children || "Create New Resume"}
    </button>
  );
}
