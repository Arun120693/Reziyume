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

      <div className="relative mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" style={{ borderColor: "rgba(107,104,128,0.2)" }}></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3" style={{ background: "rgba(255,255,255,0.9)", color: "#6b6880" }}>OR</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsLoading(true);
          signIn("google");
        }}
        disabled={isLoading}
        className="neo-input w-full flex justify-center items-center gap-3 py-3 px-4 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ color: "#2d2b3d" }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4"/>
          <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853"/>
          <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03296C-0.371021 20.0112 -0.371021 28.0009 3.03296 34.7825L11.0051 28.6006Z" fill="#FBBC05"/>
          <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4418 -0.068932 24.48 0.00161733C15.4056 0.00161733 7.10718 5.11644 3.03296 13.2296L11.0051 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

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
