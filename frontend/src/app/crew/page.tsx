"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, DollarSign, Calendar,
  ChevronRight, LogOut, User, FileText, Bell,
  CheckCircle2, Timer, Moon, Shield
} from "lucide-react";
import { attendanceAPI, dashboardAPI } from "@/lib/api";
import { CrewDashboard } from "@/types";

export default function CrewDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<CrewDashboard | null>(null);
  const [clockLoading, setClockLoading] = useState(false);
  const [clockMessage, setClockMessage] = useState("");
  const [geoStatus, setGeoStatus] = useState<"idle" | "locating" | "success" | "error">("idle");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"home" | "payslips" | "attendance" | "profile">("home");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    loadDashboard();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const loadDashboard = async () => {
    try {
      const { data } = await dashboardAPI.getCrew();
      setDashboard(data);
    } catch { /* API not connected yet */ }
  };

  const handleClock = useCallback(async () => {
    setClockLoading(true);
    setGeoStatus("locating");
    setClockMessage("");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true, timeout: 10000, maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      setGeoStatus("success");

      const isClockedIn = dashboard?.todayStatus === "CLOCKED_IN";
      const api = isClockedIn ? attendanceAPI.clockOut : attendanceAPI.clockIn;
      const { data } = await api(latitude, longitude);

      setClockMessage(data.message);
      loadDashboard();
    } catch (err: any) {
      setGeoStatus("error");
      setClockMessage(
        err.response?.data?.message ||
        err.message === "User denied Geolocation" 
          ? "Location access denied. Please enable GPS."
          : "Failed to verify location. Please try again."
      );
    } finally {
      setClockLoading(false);
    }
  }, [dashboard]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const formatPeso = (val: number) =>
    `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

  const isClockedIn = dashboard?.todayStatus === "CLOCKED_IN";
  const isClockedOut = dashboard?.todayStatus === "CLOCKED_OUT";

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  // ========== TAB CONTENT RENDERERS ==========

  const renderHomeTab = () => (
    <>
      {/* Clock Section */}
      <div className="px-5 -mt-5 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 text-center border border-white/10"
        >
          <p className="text-zinc-500 text-xs font-semibold tracking-widest uppercase mb-2">Current Time</p>
          <p className="text-4xl font-display font-black text-zinc-100 mb-1 tracking-tight">
            {mounted ? formatTime(currentTime) : "00:00:00"}
          </p>
          <p className="text-zinc-400 text-xs font-medium mb-8">
            {mounted ? currentTime.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Loading..."}
          </p>

          {/* Status Badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {isClockedIn ? (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Clocked In
              </span>
            ) : isClockedOut ? (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide">
                <CheckCircle2 size={14} />
                Shift Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold tracking-wide">
                <Clock size={14} />
                Not Clocked In
              </span>
            )}
          </div>

          {/* Giant Clock Button */}
          <motion.button
            onClick={handleClock}
            disabled={clockLoading || isClockedOut}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className={`w-40 h-40 mx-auto rounded-full flex flex-col items-center justify-center font-display font-bold text-lg transition-all ${
              isClockedOut
                ? "bg-white/5 text-zinc-600 border border-white/10 cursor-not-allowed"
                : isClockedIn
                ? "bg-crimson text-white shadow-[0_0_40px_rgba(218,41,28,0.4)] animate-pulse-golden"
                : "gradient-golden text-espresso shadow-[0_0_40px_rgba(255,199,44,0.3)] animate-pulse-golden"
            }`}
          >
            {clockLoading ? (
              <div className="w-8 h-8 border-3 border-current/30 border-t-current rounded-full animate-spin" />
            ) : isClockedOut ? (
              <>
                <CheckCircle2 size={32} />
                <span className="text-sm mt-2 font-black tracking-wide">DONE</span>
              </>
            ) : isClockedIn ? (
              <>
                <Clock size={32} />
                <span className="text-sm mt-2 font-black tracking-wide">CLOCK OUT</span>
              </>
            ) : (
              <>
                <MapPin size={32} />
                <span className="text-sm mt-2 font-black tracking-wide">CLOCK IN</span>
              </>
            )}
          </motion.button>

          {/* Geo Status */}
          <AnimatePresence>
            {clockMessage && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 text-xs font-bold ${
                  geoStatus === "error" ? "text-crimson" : "text-emerald-400"
                }`}
              >
                {clockMessage}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 mt-5 grid grid-cols-2 gap-4">
        {[
          { icon: <Timer size={18} />, label: "Hours This Month", value: dashboard?.thisMonth?.hoursWorked?.toFixed(1) || "0.0", suffix: "hrs", color: "text-golden", bg: "bg-golden/10" },
          { icon: <DollarSign size={18} />, label: "Est. Payout", value: formatPeso(dashboard?.thisMonth?.estimatedPay || 0), suffix: "", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: <Calendar size={18} />, label: "Days Present", value: dashboard?.thisMonth?.daysPresent?.toString() || "0", suffix: "days", color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: <Moon size={18} />, label: "Night Diff Hrs", value: dashboard?.thisMonth?.nightDiffHours?.toFixed(1) || "0.0", suffix: "hrs", color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-light rounded-2xl p-5 card-hover"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-zinc-100 text-xl font-display font-black tracking-tight mb-0.5">
              {stat.value}
              {stat.suffix && <span className="text-zinc-500 text-[10px] ml-1 font-bold">{stat.suffix}</span>}
            </p>
            <p className="text-zinc-400 text-[11px] font-semibold tracking-wide uppercase">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </>
  );

  const renderPayslipsTab = () => (
    <div className="px-5 mt-4 space-y-4">
      <h2 className="text-zinc-100 font-bold text-base tracking-wide">My Payslips</h2>
      {(dashboard?.recentPayrolls || []).length > 0 ? (
        dashboard!.recentPayrolls.map((payroll, i) => (
          <motion.div
            key={payroll.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-light rounded-2xl p-4 flex items-center justify-between border border-white/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-golden/10 flex items-center justify-center border border-golden/20">
                <FileText size={20} className="text-golden" />
              </div>
              <div>
                <p className="text-zinc-100 text-sm font-bold">{payroll.payrollPeriod}</p>
                <p className="text-zinc-500 text-xs font-medium mt-0.5">{payroll.totalHoursWorked?.toFixed(1)} hours</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-400 font-black text-sm">{formatPeso(payroll.netPay)}</p>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                payroll.status === "DISBURSED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                payroll.status === "APPROVED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                "bg-golden/10 text-golden border border-golden/20"
              }`}>
                {payroll.status}
              </span>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="glass-light rounded-2xl p-8 text-center border border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
            <FileText size={24} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm font-medium">No payslips generated yet</p>
          <p className="text-zinc-600 text-xs mt-1">Your payslips will appear here after payroll processing.</p>
        </div>
      )}
    </div>
  );

  const renderAttendanceTab = () => {
    const mockHistory = [
      { date: "April 15", clockIn: "2:00 PM", clockOut: "10:00 PM", hours: "8.0", status: "VERIFIED" },
      { date: "April 14", clockIn: "2:00 PM", clockOut: "10:30 PM", hours: "8.5", status: "VERIFIED" },
      { date: "April 13", clockIn: "6:00 AM", clockOut: "2:00 PM", hours: "8.0", status: "VERIFIED" },
      { date: "April 12", clockIn: "10:00 PM", clockOut: "6:00 AM", hours: "8.0", status: "NIGHT_DIFF" },
      { date: "April 11", clockIn: "2:00 PM", clockOut: "10:00 PM", hours: "8.0", status: "VERIFIED" },
    ];

    return (
      <div className="px-5 mt-4 space-y-3">
        <h2 className="text-zinc-100 font-bold text-base tracking-wide">Attendance History</h2>
        {mockHistory.map((record, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-light rounded-xl p-4 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-100 text-sm font-bold">{record.date}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                record.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                "bg-purple-500/10 text-purple-400 border border-purple-500/20"
              }`}>
                {record.status === "NIGHT_DIFF" ? "NIGHT DIFF" : record.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                In: {record.clockIn}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                Out: {record.clockOut}
              </span>
              <span className="text-zinc-300 font-bold ml-auto">{record.hours}h</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProfileTab = () => (
    <div className="px-5 mt-4 space-y-4">
      <h2 className="text-zinc-100 font-bold text-base tracking-wide">My Profile</h2>
      <div className="glass-light rounded-2xl p-6 border border-white/5 text-center">
        <div className="w-20 h-20 rounded-full gradient-golden flex items-center justify-center text-espresso font-black text-2xl mx-auto mb-4 shadow-[0_0_20px_rgba(255,199,44,0.3)]">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <p className="text-zinc-100 text-lg font-bold">{user?.firstName} {user?.lastName}</p>
        <p className="text-zinc-500 text-xs font-medium mt-1 uppercase tracking-wider">Crew Member</p>
      </div>

      <div className="glass-light rounded-2xl p-5 border border-white/5 space-y-4">
        {[
          { label: "Email", value: user?.email || "—", icon: <FileText size={16} /> },
          { label: "Branch", value: user?.branch?.name || "McDonald's Montalban", icon: <MapPin size={16} /> },
          { label: "Role", value: "Crew Member", icon: <Shield size={16} /> },
        ].map((field, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 shrink-0">
              {field.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{field.label}</p>
              <p className="text-zinc-200 text-sm font-medium truncate">{field.value}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-crimson/20 bg-crimson/10 text-crimson text-sm font-bold hover:bg-crimson/20 transition-all flex items-center justify-center gap-2"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] pb-24 text-zinc-100 font-sans">
      {/* Header */}
      <div className="gradient-golden px-5 pt-12 pb-8 rounded-b-3xl shadow-[0_10px_30px_rgba(255,199,44,0.15)] relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-espresso/70 text-xs font-bold tracking-wide uppercase">Welcome back</p>
            <h1 className="text-espresso text-2xl font-display font-black tracking-tight">
              {user?.firstName} {user?.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white/30 transition-all">
              <Bell size={18} className="text-espresso" />
            </button>
            <button
              onClick={logout}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm hover:bg-white/30 transition-all"
            >
              <LogOut size={18} className="text-espresso" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-espresso/80 text-xs font-semibold bg-white/20 w-max px-3 py-1.5 rounded-full backdrop-blur-md">
          <MapPin size={14} />
          <span>{user?.branch?.name || "McDonald's Montalban"}</span>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "home" && renderHomeTab()}
          {activeTab === "payslips" && renderPayslipsTab()}
          {activeTab === "attendance" && renderAttendanceTab()}
          {activeTab === "profile" && renderProfileTab()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 px-6 py-4 flex items-center justify-around z-50">
        {[
          { id: "home" as const, icon: <Clock size={22} />, label: "HOME" },
          { id: "payslips" as const, icon: <FileText size={22} />, label: "PAYSLIPS" },
          { id: "attendance" as const, icon: <Calendar size={22} />, label: "HISTORY" },
          { id: "profile" as const, icon: <User size={22} />, label: "PROFILE" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all ${
              activeTab === tab.id ? "text-golden scale-110" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            <span className={`text-[9px] font-bold tracking-wider ${activeTab === tab.id ? "opacity-100" : "opacity-70"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
