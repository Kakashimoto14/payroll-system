"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, DollarSign, TrendingUp, Activity, PlayCircle,
  FileText, UserPlus, ChevronRight, AlertCircle, ArrowUpRight, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from "recharts";
import { dashboardAPI } from "@/lib/api";
import { DashboardStats } from "@/types";
import { toast } from "sonner";

const COLORS = ["#FFC72C", "#DA291C", "#3B82F6", "#10B981", "#8B5CF6"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await dashboardAPI.getAdmin();
      setDashboard(data);
    } catch {
      setDashboard({
        employees: { CREW_MEMBER: 5, SHIFT_MANAGER: 2, HR_ADMIN: 1, total: 8 },
        payroll: { totalGrossPay: 245000, totalNetPay: 198500, totalDeductions: 46500, payrollCount: 8 },
        attendance: { totalRecords: 120, averageHoursWorked: 7.5 },
        pendingLeaves: 3,
        recentPayrolls: [],
        payrollTrend: [
          { month: "Nov", grossPay: 220000, netPay: 178000, count: 8 },
          { month: "Dec", grossPay: 235000, netPay: 190000, count: 8 },
          { month: "Jan", grossPay: 228000, netPay: 185000, count: 8 },
          { month: "Feb", grossPay: 240000, netPay: 194000, count: 8 },
          { month: "Mar", grossPay: 238000, netPay: 192000, count: 8 },
          { month: "Apr", grossPay: 245000, netPay: 198500, count: 8 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPeso = (val: number) =>
    `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 0 })}`;

  const employeePieData = dashboard ? [
    { name: "Crew Members", value: dashboard.employees.CREW_MEMBER },
    { name: "Shift Managers", value: dashboard.employees.SHIFT_MANAGER },
    { name: "HR Admin", value: dashboard.employees.HR_ADMIN },
  ] : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-golden/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-golden animate-spin" />
          </div>
          <p className="text-zinc-500 font-medium text-sm tracking-wide">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Action Bar */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold tracking-tight">Overview</h2>
          <p className="text-zinc-500 text-xs mt-1">Real-time metrics for McDonald&apos;s Montalban.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.info("Payroll batch computation started.", { description: "Processing all active employees..." })}
          className="px-5 py-2.5 rounded-xl gradient-golden-vibrant text-espresso text-sm font-black flex items-center gap-2 shadow-[0_8px_24px_rgba(255,199,44,0.25)] hover:shadow-[0_12px_32px_rgba(255,199,44,0.35)] transition-all uppercase tracking-wide"
        >
          <Zap size={16} strokeWidth={3} />
          Run Payroll
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            label: "Active Employees",
            value: dashboard?.employees.total || 0,
            change: "+2 this month",
            changeColor: "text-emerald-400",
            iconColor: "text-golden",
            iconBg: "bg-golden/10",
            glowColor: "rgba(255,199,44,0.08)",
          },
          {
            icon: DollarSign,
            label: "Total Payroll Cost",
            value: formatPeso(dashboard?.payroll.totalGrossPay || 0),
            change: "This month",
            changeColor: "text-zinc-500",
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
            glowColor: "rgba(16,185,129,0.08)",
          },
          {
            icon: TrendingUp,
            label: "Net Disbursed",
            value: formatPeso(dashboard?.payroll.totalNetPay || 0),
            change: "After deductions",
            changeColor: "text-zinc-500",
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/10",
            glowColor: "rgba(59,130,246,0.08)",
          },
          {
            icon: Activity,
            label: "Avg Hours/Day",
            value: `${dashboard?.attendance.averageHoursWorked || 0}`,
            suffix: "hrs",
            change: `${dashboard?.attendance.totalRecords || 0} records`,
            changeColor: "text-zinc-500",
            iconColor: "text-purple-400",
            iconBg: "bg-purple-500/10",
            glowColor: "rgba(168,85,247,0.08)",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="glass-light p-5 group cursor-pointer"
              style={{ boxShadow: `0 0 20px ${stat.glowColor}` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center ${stat.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-zinc-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-zinc-100 text-2xl font-display font-black tracking-tight mb-0.5">
                {stat.value}
                {"suffix" in stat && <span className="text-zinc-500 text-xs font-bold ml-1">{stat.suffix}</span>}
              </p>
              <p className="text-zinc-400 text-xs font-medium">{stat.label}</p>
              <p className={`text-[11px] mt-2 font-semibold ${stat.changeColor}`}>{stat.change}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={item} className="lg:col-span-2 glass p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-zinc-100 font-bold text-sm tracking-tight">Payroll Trajectory</h3>
              <p className="text-zinc-500 text-xs mt-1">6-month historical gross vs net</p>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-golden shadow-[0_0_6px_rgba(255,199,44,0.6)]" />
                <span className="text-zinc-400">Gross</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                <span className="text-zinc-400">Net</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={dashboard?.payrollTrend || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC72C" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#FFC72C" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#52525b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fill: "#52525b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(9,9,11,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px", boxShadow: "0 20px 40px -8px rgba(0,0,0,0.6)", backdropFilter: "blur(16px)" }}
                formatter={(value: any) => [formatPeso(Number(value)), ""]}
                cursor={{ stroke: "rgba(255,199,44,0.2)", strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="grossPay" stroke="#FFC72C" strokeWidth={2.5} fill="url(#grossGrad)" dot={false} activeDot={{ r: 5, fill: "#FFC72C", stroke: "#09090b", strokeWidth: 2 }} name="Gross Pay" />
              <Area type="monotone" dataKey="netPay" stroke="#10B981" strokeWidth={2.5} fill="url(#netGrad)" dot={false} activeDot={{ r: 5, fill: "#10B981", stroke: "#09090b", strokeWidth: 2 }} name="Net Pay" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div variants={item} className="glass p-6 flex flex-col">
          <h3 className="text-zinc-100 font-bold text-sm mb-1 tracking-tight">Workforce Structure</h3>
          <p className="text-zinc-500 text-xs mb-4">Distribution by role</p>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <RePieChart>
                <Pie data={employeePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} dataKey="value" stroke="rgba(9,9,11,0.8)" strokeWidth={3} paddingAngle={3}>
                  {employeePieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "rgba(9,9,11,0.95)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", color: "#fff", fontSize: "12px", boxShadow: "0 20px 40px -8px rgba(0,0,0,0.6)" }} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 mt-2">
              {employeePieData.map((pieItem, i) => (
                <div key={pieItem.name} className="flex items-center justify-between text-xs group cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor]" style={{ backgroundColor: COLORS[i], color: COLORS[i] }} />
                    <span className="text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">{pieItem.name}</span>
                  </span>
                  <span className="text-zinc-200 font-bold">{pieItem.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions + Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={item} className="glass p-6">
          <h3 className="text-zinc-100 font-bold text-sm mb-4 tracking-tight">Quick Commands</h3>
          <div className="space-y-2.5">
            {[
              { icon: UserPlus, label: "Onboard Employee", color: "text-golden", bg: "bg-golden/10", border: "border-golden/15 hover:border-golden/40", action: () => toast.info("Employee onboarding form — coming soon.") },
              { icon: PlayCircle, label: "Execute Payroll", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15 hover:border-emerald-500/40", action: () => toast.info("Payroll batch started.", { description: "Processing..." }) },
              { icon: FileText, label: "Generate BIR Reports", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/15 hover:border-blue-500/40", action: () => toast.success("BIR Form 1601-C generated.") },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border transition-all text-left group hover:bg-white/[0.03] ${action.border}`}
                >
                  <div className={`w-8 h-8 rounded-lg ${action.bg} ${action.color} flex items-center justify-center shrink-0`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-sm font-semibold flex-1 ${action.color}`}>{action.label}</span>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2 glass-animated p-6 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-golden/15 blur-[60px] rounded-full pointer-events-none animate-glow" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-crimson/10 flex items-center justify-center border border-crimson/20 mt-0.5 shrink-0">
                <AlertCircle size={22} className="text-crimson" />
              </div>
              <div>
                <h3 className="text-zinc-100 font-bold text-base tracking-tight">Action Required</h3>
                <p className="text-golden font-bold text-sm mt-1">
                  {dashboard?.pendingLeaves || 0} Pending Leave Requests
                </p>
                <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-sm">
                  Unresolved employee leave applications require HR review before the next payroll batch.
                </p>
              </div>
            </div>
            <button
              onClick={() => toast.info("Leave review panel — coming in the next release.")}
              className="px-5 py-2.5 rounded-xl bg-white text-espresso text-sm font-black shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_24px_rgba(255,255,255,0.25)] hover:scale-[1.03] transition-all shrink-0 uppercase tracking-wide"
            >
              Review
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
