"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Calendar,
  Target,
  Brain
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import API_CONFIG from "@/lib/config";

interface InsightData {
  insights: string[];
  timestamp: string;
}

const reportSections = [
  {
    title: "Executive Summary",
    icon: FileText,
    color: "from-emerald-500 to-cyan-500",
    content: "Your overall diabetes risk profile shows significant improvement over the past 30 days. The combination of clinical markers and lifestyle factors indicates a LOW to MODERATE risk category. Key improvements were observed in sleep consistency and daily activity levels."
  },
  {
    title: "Clinical Status",
    icon: Target,
    color: "from-rose-500 to-red-500",
    content: "Blood pressure and cholesterol levels are within acceptable ranges. BMI has shown a downward trend. No immediate clinical concerns identified. Recommend continuing current health behaviors and monitoring."
  },
  {
    title: "Lifestyle Assessment",
    icon: Brain,
    color: "from-violet-500 to-purple-500",
    content: "Lifestyle patterns have improved by 18%. Sleep consistency score: 78%. Daily step count averages 8,500 (above recommended 7,500). Stress management shows moderate improvement. Dietary habits are stable."
  },
  {
    title: "Recommendations",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
    items: [
      "Maintain current physical activity level of 60+ minutes daily",
      "Continue focusing on sleep consistency (target: consistent bedtime)",
      "Reduce screen time to under 6 hours daily",
      "Increase water intake to 8+ glasses daily",
      "Consider stress management techniques (meditation, yoga)"
    ]
  }
];

const riskBreakdown = [
  { name: "Genetic Factors", value: 25, color: "#f43f5e" },
  { name: "Lifestyle", value: 35, color: "#8b5cf6" },
  { name: "Clinical", value: 30, color: "#06b6d4" },
  { name: "Environmental", value: 10, color: "#10b981" },
];

const monthlyProgress = [
  { month: "Jan", risk: 65, target: 50 },
  { month: "Feb", risk: 58, target: 50 },
  { month: "Mar", risk: 52, target: 50 },
  { month: "Apr", risk: 45, target: 50 },
  { month: "May", risk: 40, target: 50 },
  { month: "Jun", risk: 35, target: 50 },
];

export default function Insights() {
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_CONFIG.endpoints.insights.generate);
        const data: InsightData = await response.json();
        setAiInsights(data.insights);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
      setLoading(false);
    };

    fetchInsights();
    const interval = setInterval(fetchInsights, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Insights & Reports
            </span>
          </h1>
          <p className="text-slate-400">AI-generated health observations and comprehensive analysis</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {reportSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} p-0.5`}>
                    <div className="w-full h-full rounded-lg bg-[#030712] flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                </div>

                {section.content && (
                  <p className="text-slate-300 leading-relaxed">{section.content}</p>
                )}

                {section.items && (
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">AI Health Observations</h2>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="text-slate-500">Loading insights...</div>
                ) : (
                  aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-300">{insight}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Factor Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {riskBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400">{item.name}</span>
                    </div>
                    <span className="text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Risk Progress</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyProgress}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="risk" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Your Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
                  <span className="text-slate-400">Target</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}