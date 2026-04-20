"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Clock, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const mockAttendance = [
  { id: "ATT-001", employee: "Juan Dela Cruz", role: "HR_ADMIN", date: "April 15, 2026", clockIn: "08:00 AM", clockOut: "05:00 PM", hours: 8, location: "Montalban Branch", status: "VERIFIED" },
  { id: "ATT-002", employee: "Maria Santos", role: "SHIFT_MANAGER", date: "April 15, 2026", clockIn: "06:00 AM", clockOut: "02:00 PM", hours: 8, location: "Montalban Branch", status: "VERIFIED" },
  { id: "ATT-003", employee: "Pedro Reyes", role: "CREW_MEMBER", date: "April 15, 2026", clockIn: "02:00 PM", clockOut: "10:00 PM", hours: 8, location: "Montalban Branch", status: "VERIFIED" },
  { id: "ATT-004", employee: "Ana Lim", role: "CREW_MEMBER", date: "April 15, 2026", clockIn: "10:00 PM", clockOut: "06:00 AM", hours: 8, location: "Montalban Branch", status: "NIGHT_DIFF" },
];

const ROLE_LABELS: Record<string, string> = {
  HR_ADMIN: "HR Admin",
  SHIFT_MANAGER: "Shift Manager",
  CREW_MEMBER: "Crew Member",
};

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredLogs = mockAttendance.filter(log => {
    const matchesSearch = log.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold">Attendance Logs</h2>
          <p className="text-zinc-500 text-xs mt-1">Geofenced time tracking and daily records.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toast.success("Attendance report exported.")}
          className="px-4 py-2.5 rounded-xl glass-light text-zinc-300 text-sm font-bold flex items-center gap-2 transition-all hover:text-white"
        >
          <Download size={18} />
          Export CSV
        </motion.button>
      </div>

      {/* Table Section */}
      <div className="glass overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input type="date" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 focus:outline-none focus:border-golden/50 transition-all" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 focus:outline-none focus:border-golden/50 transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="VERIFIED">Verified</option>
              <option value="NIGHT_DIFF">Night Diff</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Clock In</th>
                <th className="px-6 py-4 font-semibold">Clock Out</th>
                <th className="px-6 py-4 font-semibold text-center">Hours</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-golden/10 border border-golden/20 flex items-center justify-center text-golden font-bold text-xs shrink-0">
                        {log.employee.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-100 group-hover:text-golden transition-colors">{log.employee}</p>
                        <p className="text-zinc-500 text-xs">{ROLE_LABELS[log.role] || log.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">{log.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-emerald-400 font-medium text-xs">
                      <Clock size={14} className="shrink-0" /> {log.clockIn}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-zinc-400 font-medium text-xs">
                      <Clock size={14} className="shrink-0" /> {log.clockOut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-zinc-300">{log.hours}h</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      log.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}>
                      <MapPin size={10} />
                      {log.status === "NIGHT_DIFF" ? "NIGHT DIFF" : log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
