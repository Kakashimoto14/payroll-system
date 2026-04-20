"use client";

import { motion } from "framer-motion";
import { Download, FileText, PieChart, TrendingUp, Landmark } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const reports = [
    { title: "Monthly Payroll Summary", desc: "Aggregated gross pay, deductions, and net disbursements for the selected period.", icon: <TrendingUp size={24} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "BIR Form 1601-C", desc: "Monthly remittance return of income taxes withheld on compensation.", icon: <FileText size={24} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "SSS & PhilHealth Contributions", desc: "Mandatory government deduction report for the current quarter.", icon: <PieChart size={24} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Pag-IBIG Fund Report", desc: "Monthly Pag-IBIG contribution remittance report for all active employees.", icon: <Landmark size={24} />, color: "text-golden", bg: "bg-golden/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold">Reports & Analytics</h2>
          <p className="text-zinc-500 text-xs mt-1">Generate required government forms and financial summaries.</p>
        </div>
        <div className="flex gap-3">
          <input type="month" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 focus:outline-none focus:border-golden/50 transition-all" defaultValue="2026-04" />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success("All reports exported.", { description: "4 files generated and downloaded." })}
            className="px-5 py-2.5 rounded-xl gradient-golden text-espresso text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,199,44,0.3)] transition-all"
          >
            <Download size={18} />
            Export All
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((report, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 card-hover flex flex-col h-full"
          >
            <div className={`w-12 h-12 rounded-xl ${report.bg} ${report.color} flex items-center justify-center mb-5 shrink-0`}>
              {report.icon}
            </div>
            <h3 className="text-zinc-100 font-bold text-base mb-2">{report.title}</h3>
            <p className="text-zinc-400 text-sm flex-1 leading-relaxed">{report.desc}</p>
            <button
              onClick={() => toast.success(`${report.title} generated.`, { description: "File is ready for download." })}
              className="mt-6 w-full py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Generate Report
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
