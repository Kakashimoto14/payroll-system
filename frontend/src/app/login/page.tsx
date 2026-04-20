"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "HR_ADMIN") router.push("/admin");
      else if (data.user.role === "SHIFT_MANAGER") router.push("/manager");
      else router.push("/crew");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* LEFT PANEL — Cinematic Brand Hero */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#09090b]">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-golden/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[55%] h-[50%] bg-crimson/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-golden/8 rounded-full blur-[80px] animate-glow" />
        </div>

        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top — Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <img src="/mcdonalds-logo.png" alt="McDonald's" className="w-12 h-12 object-contain drop-shadow-lg" />
            <div>
              <p className="text-zinc-100 font-display font-black text-lg tracking-tight">McDonald&apos;s</p>
              <p className="text-golden text-[10px] font-bold uppercase tracking-[0.2em]">Montalban • Rizal</p>
            </div>
          </motion.div>

          {/* Center — Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-[2px] bg-golden rounded-full" />
              <p className="text-golden text-xs font-bold uppercase tracking-[0.2em]">Enterprise Payroll</p>
            </div>
            <h1 className="text-5xl font-display font-black text-zinc-100 leading-[1.1] mb-6 tracking-tight">
              Workforce
              <br />
              <span className="gradient-text-golden text-glow-golden">Management</span>
              <br />
              Reimagined
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              A complete payroll solution built for Philippine labor compliance — SSS, PhilHealth, Pag-IBIG, and TRAIN law automated.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {["Geofenced Attendance", "Auto-Deductions", "Real-time Dashboard"].map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold text-zinc-400 bg-white/5 border border-white/8 tracking-wide"
                >
                  {feature}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bottom — Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex items-center gap-8"
          >
            {[
              { value: "8", label: "Employees" },
              { value: "99.2%", label: "Uptime" },
              { value: "₱245K", label: "Monthly Payroll" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-zinc-100 text-2xl font-display font-black tracking-tight">{stat.value}</p>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT PANEL — Login Form */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#0a0a0c] lg:bg-[#0c0c0e]">
        {/* Mobile background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-golden/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-crimson/5 rounded-full blur-[150px]" />
        </div>

        {/* Subtle edge gradient on desktop */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent pointer-events-none z-10" />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[420px] px-8 relative z-20"
        >
          {/* Mobile Logo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-10 lg:hidden"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-golden-vibrant mb-5 shadow-[0_20px_40px_rgba(255,199,44,0.25)] border border-white/20">
              <img src="/mcdonalds-logo.png" alt="McDonald's" className="w-14 h-14 object-contain" />
            </div>
            <h1 className="text-3xl font-display font-black text-zinc-100 tracking-tight">
              McDonald&apos;s
            </h1>
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mt-1">Payroll System</p>
          </motion.div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-display font-black text-zinc-100 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-zinc-500 text-sm font-medium">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson text-sm font-medium overflow-hidden"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mcdonalds.ph"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-golden/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,199,44,0.08)] transition-all font-medium text-sm"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-2.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-golden/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(255,199,44,0.08)] transition-all font-medium text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-golden transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-4 mt-3 rounded-xl gradient-golden-vibrant text-espresso font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(255,199,44,0.25)] hover:shadow-[0_12px_32px_rgba(255,199,44,0.35)] transition-all disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-espresso/30 border-t-espresso rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-10 pt-8 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 justify-center mb-5">
              <Sparkles size={12} className="text-golden" />
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                Demo Credentials
              </p>
              <Sparkles size={12} className="text-golden" />
            </div>
            <div className="space-y-2">
              {[
                { role: "HR Admin", email: "maria.santos@mcd-montalban.com", badge: "bg-golden/10 text-golden border-golden/20" },
                { role: "Manager", email: "juan.delacruz@mcd-montalban.com", badge: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
                { role: "Crew", email: "carlo.garcia@mcd-montalban.com", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              ].map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword("password123");
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.12] transition-all flex justify-between items-center group"
                >
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${cred.badge}`}>
                    {cred.role}
                  </span>
                  <span className="text-zinc-500 group-hover:text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5">
                    {cred.email}
                    <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-zinc-700 text-[10px] font-bold mt-10 uppercase tracking-[0.15em]">
            © 2026 McDonald&apos;s Montalban, Rizal
          </p>
        </motion.div>
      </div>
    </div>
  );
}
