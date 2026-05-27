"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4">

      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-2xl font-semibold mb-2 tracking-tight">
          Create your account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Get started with tokenized real estate
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-blue-500 transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* Footer */}
        <div className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>

        {/* Trust signal */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure • Encrypted • Built for real-world assets
        </p>
      </div>
    </div>
  );
}