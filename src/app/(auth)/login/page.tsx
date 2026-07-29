"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-center" style={{ color: "#2d2b3d" }}>Welcome back</h3>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#4a4760" }}>
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#9490b0" }}>
              <Mail className="h-4.5 w-4.5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neo-input w-full pl-10 pr-4 py-3 text-sm"
              style={{ color: "#2d2b3d" }}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#4a4760" }}>
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#9490b0" }}>
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input w-full pl-10 pr-4 py-3 text-sm"
              style={{ color: "#2d2b3d" }}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm font-medium p-3 rounded-xl border"
            style={{
              color: "#e11d48",
              background: "rgba(225,29,72,0.08)",
              border: "1px solid rgba(225,29,72,0.2)"
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="accent-btn w-full flex justify-center py-3 px-4 text-sm font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: "#6b6880" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "#7c6ff7" }}
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
