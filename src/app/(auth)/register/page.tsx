"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        throw new Error("Failed to auto-login. Please sign in manually.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 text-center" style={{ color: "#2d2b3d" }}>Create your account</h3>

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
            Password <span style={{ color: "#9490b0", fontWeight: 400 }}>(min. 6 characters)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: "#9490b0" }}>
              <Lock className="h-4.5 w-4.5" />
            </div>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input w-full pl-10 pr-4 py-3 text-sm"
              style={{ color: "#2d2b3d" }}
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm font-medium p-3 rounded-xl"
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
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: "#6b6880" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold transition-colors hover:opacity-80"
            style={{ color: "#7c6ff7" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
