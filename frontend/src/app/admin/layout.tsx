"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, DollarSign, Clock, FileText, BarChart3,
  Settings, LogOut, ChevronLeft, Bell, Search, Menu
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { id: "dashboard", icon: BarChart3, label: "Dashboard", href: "/admin" },
  { id: "employees", icon: Users, label: "Employees", href: "/admin/employees" },
  { id: "payroll", icon: DollarSign, label: "Payroll", href: "/admin/payroll" },
  { id: "attendance", icon: Clock, label: "Attendance", href: "/admin/attendance" },
  { id: "reports", icon: FileText, label: "Reports", href: "/admin/reports" },
  { id: "settings", icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/login"); return; }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "HR_ADMIN") { router.replace("/crew"); return; }
    setUser(parsed);
  }, [router]);

  const logout = () => { localStorage.clear(); router.replace("/login"); };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex text-zinc-100 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`${sidebarOpen ? "w-[260px]" : "w-[76px]"} bg-[#0c0c0e] border-r border-white/[0.06] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sticky top-0 h-screen z-40`}
      >
        {/* Logo + Collapse */}
        <div className="p-4 flex items-center gap-3 border-b border-white/[0.06] h-[72px]">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src="/mcdonalds-logo.png" alt="McDonald's" className="w-9 h-9 object-contain" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <h1 className="text-zinc-100 font-display font-black text-[13px] leading-tight tracking-tight">
                  McDonald&apos;s
                </h1>
                <p className="text-golden text-[9px] uppercase font-bold tracking-[0.15em]">Payroll System</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-white/5 shrink-0"
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2.5 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href} className="block">
                <div
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 group ${
                    isActive
                      ? "nav-item-active text-golden font-bold"
                      : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] font-medium"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-golden/15 text-golden shadow-[0_0_12px_rgba(255,199,44,0.15)]"
                      : "text-zinc-500 group-hover:text-zinc-300 group-hover:bg-white/[0.06]"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-9 h-9 rounded-xl gradient-golden-vibrant flex items-center justify-center text-espresso font-black text-[11px] shrink-0 shadow-[0_4px_12px_rgba(255,199,44,0.25)]">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex-1 min-w-0"
                >
                  <p className="text-zinc-200 text-xs font-bold truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-zinc-500 text-[10px] font-medium">HR Administrator</p>
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarOpen && (
              <button onClick={logout} className="text-zinc-600 hover:text-crimson transition-colors shrink-0 p-1.5 rounded-lg hover:bg-crimson/10">
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#09090b]/70 backdrop-blur-xl border-b border-white/[0.06] px-8 h-[72px] flex items-center justify-between">
          <div>
            <h1 className="text-zinc-100 text-lg font-display font-bold tracking-tight">
              {SIDEBAR_ITEMS.find((i) => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href)))?.label || "Dashboard"}
            </h1>
            <p className="text-zinc-500 text-[11px] font-medium mt-0.5 tracking-wide">
              {mounted ? new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                placeholder="Search..."
                className="w-52 pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-golden/30 focus:w-72 transition-all duration-300"
              />
            </div>
            {/* Notifications */}
            <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.08] transition-all badge-pulse">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 bg-dot-grid flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
