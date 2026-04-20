"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Mail, Phone, Calendar, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

const mockEmployees = [
  { id: "EMP-001", name: "Juan Dela Cruz", role: "HR_ADMIN", email: "juan@mcdonalds.ph", phone: "0917-123-4567", status: "ACTIVE", hired: "2023-01-15" },
  { id: "EMP-002", name: "Maria Santos", role: "SHIFT_MANAGER", email: "maria@mcdonalds.ph", phone: "0918-234-5678", status: "ACTIVE", hired: "2023-05-20" },
  { id: "EMP-003", name: "Pedro Reyes", role: "CREW_MEMBER", email: "pedro@mcdonalds.ph", phone: "0919-345-6789", status: "ACTIVE", hired: "2024-02-10" },
  { id: "EMP-004", name: "Ana Lim", role: "CREW_MEMBER", email: "ana@mcdonalds.ph", phone: "0920-456-7890", status: "ON_LEAVE", hired: "2024-03-05" },
  { id: "EMP-005", name: "Carlos Garcia", role: "CREW_MEMBER", email: "carlos@mcdonalds.ph", phone: "0921-567-8901", status: "ACTIVE", hired: "2024-04-12" },
];

const ROLE_LABELS: Record<string, string> = { HR_ADMIN: "HR Admin", SHIFT_MANAGER: "Shift Manager", CREW_MEMBER: "Crew Member" };
const ROLE_BADGES: Record<string, string> = { HR_ADMIN: "bg-golden/10 text-golden border-golden/20", SHIFT_MANAGER: "bg-blue-500/10 text-blue-400 border-blue-500/20", CREW_MEMBER: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" };

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold tracking-tight">Employee Directory</h2>
          <p className="text-zinc-500 text-xs mt-1">Manage personnel records and access.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => toast.info("Employee onboarding form — coming soon.")} className="px-5 py-2.5 rounded-xl gradient-golden-vibrant text-espresso text-sm font-black flex items-center gap-2 shadow-[0_8px_24px_rgba(255,199,44,0.25)] transition-all uppercase tracking-wide">
          <Plus size={16} strokeWidth={3} /> Add Employee
        </motion.button>
      </motion.div>

      <motion.div variants={item} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-2.5 pl-11 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-golden/40 focus:shadow-[0_0_0_3px_rgba(255,199,44,0.06)] transition-all" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-medium text-zinc-300 focus:outline-none focus:border-golden/40 transition-all appearance-none cursor-pointer">
          <option value="ALL">All Roles</option>
          <option value="HR_ADMIN">HR Admin</option>
          <option value="SHIFT_MANAGER">Shift Manager</option>
          <option value="CREW_MEMBER">Crew Member</option>
        </select>
      </motion.div>

      <motion.div variants={item} className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.03] border-b border-white/[0.06]">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider"><span className="inline-flex items-center gap-1.5 cursor-pointer hover:text-zinc-200 transition-colors">Date Hired <ArrowUpDown size={12} /></span></th>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-zinc-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, i) => (
                <motion.tr key={emp.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="table-row-hover group border-b border-white/[0.03] last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-golden/20 to-golden/5 border border-golden/15 flex items-center justify-center text-golden font-black text-sm shrink-0">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="text-zinc-100 font-bold group-hover:text-golden transition-colors text-sm">{emp.name}</p>
                        <p className="text-zinc-600 text-[11px] font-mono">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${ROLE_BADGES[emp.role]}`}>{ROLE_LABELS[emp.role]}</span></td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-zinc-400 text-xs"><Mail size={12} className="shrink-0 text-zinc-600" /> {emp.email}</div>
                      <div className="flex items-center gap-2 text-zinc-400 text-xs"><Phone size={12} className="shrink-0 text-zinc-600" /> {emp.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex items-center gap-2 text-zinc-400 text-xs"><Calendar size={13} className="shrink-0 text-zinc-600" /> {emp.hired}</span></td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider ${emp.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" : "bg-golden/10 text-golden border border-golden/15"}`}>{emp.status === "ON_LEAVE" ? "ON LEAVE" : emp.status}</span></td>
                  <td className="px-6 py-4 text-right"><button onClick={() => toast.info(`View profile for ${emp.name} — coming soon.`)} className="p-2 rounded-lg text-zinc-600 hover:bg-white/[0.06] hover:text-zinc-300 transition-all"><MoreHorizontal size={16} /></button></td>
                </motion.tr>
              ))}
              {filteredEmployees.length === 0 && (<tr><td colSpan={6} className="px-6 py-16 text-center"><p className="text-zinc-500 text-sm font-medium">No employees match your search criteria.</p></td></tr>)}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
