"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogOut, LayoutDashboard, Users, Clock, AlertTriangle,
  CheckCircle2, ChevronRight, Calendar, MapPin
} from "lucide-react";

const mockTeam = [
  { name: "Pedro Reyes", role: "Crew Member", status: "CLOCKED_IN", shift: "2:00 PM - 10:00 PM" },
  { name: "Ana Lim", role: "Crew Member", status: "ON_LEAVE", shift: "—" },
  { name: "Carlos Garcia", role: "Crew Member", status: "NOT_CLOCKED_IN", shift: "6:00 PM - 2:00 AM" },
  { name: "Rosa Cruz", role: "Crew Member", status: "CLOCKED_IN", shift: "10:00 AM - 6:00 PM" },
];

const mockAlerts = [
  { message: "Carlos Garcia has not clocked in for his 6:00 PM shift", type: "warning", time: "15 min ago" },
  { message: "Ana Lim's sick leave approved for April 16-18", type: "info", time: "2 hours ago" },
];

export default function ManagerDashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role === "HR_ADMIN") { router.replace("/admin"); return; }
    if (parsed.role === "CREW_MEMBER") { router.replace("/crew"); return; }
    setUser(parsed);
  }, [router]);

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  if (!mounted) return null;

  const activeCount = mockTeam.filter(m => m.status === "CLOCKED_IN").length;
  const absentCount = mockTeam.filter(m => m.status === "NOT_CLOCKED_IN").length;

  const sidebarItems = [
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/manager" },
    { id: "team", icon: <Users size={20} />, label: "My Team", href: "/manager/team" },
    { id: "schedules", icon: <Clock size={20} />, label: "Schedules", href: "/manager/schedules" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass border-r border-white/10 flex flex-col transition-all duration-300 sticky top-0 h-screen z-40"
      >
        {/* Logo */}
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <img src="/mcdonalds-logo.png" alt="McDonald's" className="w-10 h-10 object-contain shrink-0" />
          <div className="overflow-hidden">
            <h1 className="text-zinc-100 font-display font-bold text-sm leading-tight">
              McDonald&apos;s
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Manager Portal</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href} className="block w-full">
                <button
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-golden/10 text-golden shadow-[0_0_15px_rgba(255,199,44,0.15)] font-bold border border-golden/20"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent font-medium"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-golden flex items-center justify-center text-espresso font-bold text-sm shrink-0 shadow-[0_0_10px_rgba(255,199,44,0.3)]">
              {user?.firstName?.[0] || 'M'}{user?.lastName?.[0] || 'G'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-zinc-100 text-xs font-bold truncate">
                {user?.firstName || 'Shift'} {user?.lastName || 'Manager'}
              </p>
              <p className="text-zinc-500 text-[10px] font-medium tracking-wide">Shift Manager</p>
            </div>
            <button onClick={logout} className="text-zinc-500 hover:text-crimson transition-colors shrink-0 p-1">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-100 text-xl font-display font-bold">Manager Dashboard</h1>
            <p className="text-zinc-400 text-xs font-medium mt-0.5">
              {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-light p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={22} />
                </div>
              </div>
              <p className="text-zinc-100 text-3xl font-display font-bold">{activeCount}</p>
              <p className="text-zinc-400 text-sm font-medium mt-1">On Shift Now</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-light p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center text-crimson">
                  <AlertTriangle size={22} />
                </div>
              </div>
              <p className="text-zinc-100 text-3xl font-display font-bold">{absentCount}</p>
              <p className="text-zinc-400 text-sm font-medium mt-1">Not Clocked In</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-light p-6 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-golden/10 flex items-center justify-center text-golden">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-zinc-100 text-3xl font-display font-bold">{mockTeam.length}</p>
              <p className="text-zinc-400 text-sm font-medium mt-1">Total Team Members</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Team Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 glass p-6"
            >
              <h3 className="text-zinc-100 font-bold text-base mb-5">Today&apos;s Team Status</h3>
              <div className="space-y-3">
                {mockTeam.map((member, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-golden/10 border border-golden/20 flex items-center justify-center text-golden font-bold text-sm shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-zinc-100 text-sm font-bold">{member.name}</p>
                        <p className="text-zinc-500 text-xs">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-400 text-xs font-medium hidden md:inline-flex items-center gap-1.5">
                        <Clock size={12} /> {member.shift}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                        member.status === "CLOCKED_IN" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        member.status === "ON_LEAVE" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-crimson/10 text-crimson border border-crimson/20"
                      }`}>
                        {member.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6"
            >
              <h3 className="text-zinc-100 font-bold text-base mb-5">Shift Alerts</h3>
              <div className="space-y-3">
                {mockAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      {alert.type === "warning" ? (
                        <AlertTriangle size={16} className="text-golden mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 size={16} className="text-blue-400 mt-0.5 shrink-0" />
                      )}
                      <p className="text-zinc-300 text-xs leading-relaxed">{alert.message}</p>
                    </div>
                    <p className="text-zinc-600 text-[10px] font-medium pl-7">{alert.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
