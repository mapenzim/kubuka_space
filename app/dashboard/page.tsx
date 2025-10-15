"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, FileText, Activity } from "lucide-react";

const data = [
  { name: "Mon", posts: 4 },
  { name: "Tue", posts: 7 },
  { name: "Wed", posts: 3 },
  { name: "Thu", posts: 8 },
  { name: "Fri", posts: 5 },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<Users />} label="Total Users" value="1,245" />
        <StatCard icon={<FileText />} label="Total Posts" value="340" />
        <StatCard icon={<Activity />} label="Active Sessions" value="56" />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Posts Created This Week
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <p>Data</p>
            {/*<BarChart data={data}>
              <XAxis dataKey="name" stroke="#888" />
              <Tooltip />
              <Bar dataKey="posts" fill="#3b82f6" radius={6} />
            </BarChart>*/}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-4 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-800"
    >
      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
      </div>
    </motion.div>
  );
}
