"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, PlayCircle, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const mockPayrolls = [
  { id: "PAY-1001", employee: "Juan Dela Cruz", period: "April 1-15, 2026", gross: 14500, deductions: 1200, net: 13300, status: "DISBURSED" },
  { id: "PAY-1002", employee: "Maria Santos", period: "April 1-15, 2026", gross: 18500, deductions: 1500, net: 17000, status: "APPROVED" },
  { id: "PAY-1003", employee: "Pedro Reyes", period: "April 1-15, 2026", gross: 8500, deductions: 450, net: 8050, status: "COMPUTED" },
  { id: "PAY-1004", employee: "Ana Lim", period: "April 1-15, 2026", gross: 7200, deductions: 350, net: 6850, status: "COMPUTED" },
];

export default function PayrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const formatPeso = (val: number) => `₱${val.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const filteredPayrolls = mockPayrolls.filter(p => {
    const matchesSearch = p.employee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDisbursed = mockPayrolls.filter(p => p.status === "DISBURSED").reduce((sum, p) => sum + p.net, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold">Payroll Processing</h2>
          <p className="text-zinc-500 text-xs mt-1">Compute, review, and disburse employee salaries.</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success("Bank file exported successfully.", { description: "payroll_apr_2026.csv downloaded." })}
            className="px-4 py-2.5 rounded-xl glass-light text-zinc-300 text-sm font-bold flex items-center gap-2 transition-all hover:text-white"
          >
            <Download size={18} />
            Export Bank File
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.info("Payroll batch computation started.", { description: "Processing 4 employee records..." })}
            className="px-5 py-2.5 rounded-xl gradient-golden text-espresso text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,199,44,0.3)] transition-all"
          >
            <PlayCircle size={18} />
            Run Batch
          </motion.button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-golden/10 flex items-center justify-center text-golden shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-medium">Pending Computation</p>
            <p className="text-zinc-100 text-2xl font-bold font-display mt-0.5">
              {mockPayrolls.filter(p => p.status === "COMPUTED").length}
            </p>
          </div>
        </div>
        <div className="glass p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-medium">Ready for Disbursement</p>
            <p className="text-zinc-100 text-2xl font-bold font-display mt-0.5">
              {mockPayrolls.filter(p => p.status === "APPROVED").length}
            </p>
          </div>
        </div>
        <div className="glass p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Download size={24} />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-medium">Total Disbursed (Period)</p>
            <p className="text-zinc-100 text-2xl font-bold font-display mt-0.5">{formatPeso(totalDisbursed)}</p>
          </div>
        </div>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 focus:outline-none focus:border-golden/50 transition-all appearance-none cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">All Status</option>
            <option value="COMPUTED">Computed</option>
            <option value="APPROVED">Approved</option>
            <option value="DISBURSED">Disbursed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Payroll ID</th>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Period</th>
                <th className="px-6 py-4 font-semibold text-right">Gross Pay</th>
                <th className="px-6 py-4 font-semibold text-right">Deductions</th>
                <th className="px-6 py-4 font-semibold text-right text-emerald-400">Net Pay</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredPayrolls.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 font-mono text-zinc-500 text-xs">{p.id}</td>
                  <td className="px-6 py-4 font-bold text-zinc-100 group-hover:text-golden transition-colors">{p.employee}</td>
                  <td className="px-6 py-4 text-zinc-400 text-xs">{p.period}</td>
                  <td className="px-6 py-4 text-right text-zinc-300 font-medium">{formatPeso(p.gross)}</td>
                  <td className="px-6 py-4 text-right text-crimson font-medium">-{formatPeso(p.deductions)}</td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-bold">{formatPeso(p.net)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      p.status === "DISBURSED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      p.status === "APPROVED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-golden/10 text-golden border border-golden/20"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPayrolls.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No payroll records found.
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
