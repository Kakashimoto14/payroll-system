"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, MapPin, Clock, Shield, Bell, Save, Building } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [geofenceRadius, setGeofenceRadius] = useState("500");
  const [payPeriod, setPayPeriod] = useState("SEMI_MONTHLY");
  const [overtimeRate, setOvertimeRate] = useState("25");
  const [nightDiffRate, setNightDiffRate] = useState("10");
  const [notifyPayslip, setNotifyPayslip] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);

  const handleSave = () => {
    toast.success("Settings saved successfully.", { description: "Changes will take effect on the next payroll cycle." });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-zinc-100 text-lg font-bold">System Settings</h2>
          <p className="text-zinc-500 text-xs mt-1">Configure branch, payroll, and notification preferences.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl gradient-golden text-espresso text-sm font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,199,44,0.3)] transition-all"
        >
          <Save size={18} />
          Save Changes
        </motion.button>
      </div>

      {/* Branch & Geofence */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-golden/10 flex items-center justify-center text-golden shrink-0">
            <Building size={20} />
          </div>
          <div>
            <h3 className="text-zinc-100 font-bold text-sm">Branch & Geofence</h3>
            <p className="text-zinc-500 text-xs">Configure attendance location verification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Primary Branch
            </label>
            <input
              type="text"
              value="McDonald's Montalban Highway"
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> Geofence Radius (meters)</span>
            </label>
            <input
              type="number"
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Payroll Config */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-zinc-100 font-bold text-sm">Payroll Configuration</h3>
            <p className="text-zinc-500 text-xs">Pay period and rate settings for Calabarzon Region IV-A.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Pay Period
            </label>
            <select
              value={payPeriod}
              onChange={(e) => setPayPeriod(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-golden/50 transition-all appearance-none cursor-pointer"
            >
              <option value="SEMI_MONTHLY">Semi-Monthly (1st & 16th)</option>
              <option value="MONTHLY">Monthly</option>
              <option value="WEEKLY">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Overtime Premium (%)
            </label>
            <input
              type="number"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Night Differential (%)
            </label>
            <input
              type="number"
              value={nightDiffRate}
              onChange={(e) => setNightDiffRate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-zinc-100 font-bold text-sm">Notifications</h3>
            <p className="text-zinc-500 text-xs">Configure SMS and email notification triggers.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div>
              <p className="text-zinc-100 text-sm font-medium">Payslip Notifications</p>
              <p className="text-zinc-500 text-xs mt-0.5">Send SMS/Email when payslips are generated</p>
            </div>
            <input
              type="checkbox"
              checked={notifyPayslip}
              onChange={(e) => setNotifyPayslip(e.target.checked)}
              className="w-5 h-5 rounded accent-golden cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div>
              <p className="text-zinc-100 text-sm font-medium">Attendance Alerts</p>
              <p className="text-zinc-500 text-xs mt-0.5">Notify managers when crew members clock in late</p>
            </div>
            <input
              type="checkbox"
              checked={notifyAttendance}
              onChange={(e) => setNotifyAttendance(e.target.checked)}
              className="w-5 h-5 rounded accent-golden cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="glass p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center text-crimson shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="text-zinc-100 font-bold text-sm">Security</h3>
            <p className="text-zinc-500 text-xs">Account and authentication settings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-100 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-golden/50 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
