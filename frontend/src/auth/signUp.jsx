import React, { useState } from "react";
import { Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL;
import PageLoader from "../compo/Loader";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {

      
      
      const ress = await fetch(`${API_BASE}/auth/signUp`, {
        method: "POST",
         credentials: "include", // 🔥 REQUIRED
    headers: {
      "Content-Type": "application/json",
      
    },

        body: JSON.stringify({ email, password }),
      });

      const res = await ress.json();

      if (res.message === "Success") {
        window.location.href = "/";
      } else {
        setErrors(res.errors || ["Signup failed"]);
      }
    } catch (err) {
      setErrors(["Signup failed"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* Soft Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

        {/* Heading */}
        <h2 className="text-3xl font-light mb-2 tracking-wide">
          Create Account
        </h2>

        <p className="text-white/50 text-sm mb-10">
          Begin your story journey
        </p>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-sm text-red-400">
            <ul className="space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="pl-3 border-l-2 border-red-400/50">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white focus:bg-white/10 transition-all duration-300"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 py-3 rounded-xl font-medium tracking-wide transition duration-300
              ${
                loading
                  ? "bg-white/40 text-black/60 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90"
              }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-white/40">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-white hover:underline cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>

      {loading && <PageLoader text="Creating Account" />}
    </div>
  );
}
