"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Heart, 
  Brain, 
  Watch, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const healthData = [
  { month: "Jan", risk: 45 },
  { month: "Feb", risk: 42 },
  { month: "Mar", risk: 48 },
  { month: "Apr", risk: 38 },
  { month: "May", risk: 35 },
  { month: "Jun", risk: 32 },
];

const metrics = [
  { 
    label: "Clinical Risk", 
    value: "32.5%", 
    change: "-5.2%", 
    trend: "down",
    icon: Heart,
    color: "from-rose-500 to-red-600"
  },
  { 
    label: "Lifestyle Risk", 
    value: "28.3%", 
    change: "-3.1%", 
    trend: "down",
    icon: Brain,
    color: "from-violet-500 to-purple-600"
  },
  { 
    label: "Metabolic Score", 
    value: "74.2", 
    change: "+8.5%", 
    trend: "up",
    icon: Activity,
    color: "from-emerald-500 to-green-600"
  },
  { 
    label: "Active Alerts", 
    value: "3", 
    change: "-2", 
    trend: "down",
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-600"
  },
];

const quickActions = [
  { label: "Clinical Prediction", href: "/clinical", icon: Heart, desc: "Input clinical data for risk assessment" },
  { label: "Lifestyle Analysis", href: "/lifestyle", icon: Brain, desc: "Analyze behavioral patterns" },
  { label: "Real-Time Monitor", href: "/realtime", icon: Watch, desc: "Live health metrics streaming" },
  { label: "AI Insights", href: "/insights", icon: Sparkles, desc: "Personalized recommendations" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Health Dashboard
            </span>
          </h1>
          <p className="text-slate-400">Your comprehensive diabetes risk overview</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} p-0.5`}>
                  <div className="w-full h-full rounded-lg bg-[#030712] flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === "up" ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-slate-500">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Risk Trend (6 Months)</h2>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Improving</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <action.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{action.label}</div>
                    <div className="text-xs text-slate-500 truncate">{action.desc}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">AI Health Summary</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3">
              <p className="text-slate-300">
                Based on your recent clinical and lifestyle data, your diabetes risk has decreased by 13% over the past 6 months. 
                Key improvements include better sleep consistency and increased physical activity.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                  Risk Decreasing
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm">
                  Healthy Progress
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}