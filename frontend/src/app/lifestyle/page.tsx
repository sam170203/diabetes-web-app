"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Moon, 
  Footprints, 
  Droplets, 
  Utensils, 
  Cigarette, 
  Wine, 
  Smartphone, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area
} from "recharts";
import API_CONFIG from "@/lib/config";

interface LifestyleResult {
  risk_score: number;
  metabolic_score: number;
  risk_level: string;
  recommendation: string;
  insights: string[];
  positive_feedback: string[];
  feature_importance: Array<{ feature: string; importance: number }>;
}

const lifestyleInputs = [
  { key: "sleep_duration", label: "Sleep Duration (hours)", min: 4, max: 12, step: 0.5, icon: Moon },
  { key: "sleep_consistency", label: "Sleep Consistency (0-1)", min: 0, max: 1, step: 0.1, icon: Moon },
  { key: "daily_activity", label: "Daily Activity (minutes)", min: 0, max: 120, step: 5, icon: Activity },
  { key: "steps_walked", label: "Steps Walked", min: 1000, max: 15000, step: 100, icon: Footprints },
  { key: "water_intake", label: "Water Intake (glasses)", min: 1, max: 12, step: 1, icon: Droplets },
  { key: "meal_timing_score", label: "Meal Timing Score (0-1)", min: 0, max: 1, step: 0.1, icon: Utensils },
  { key: "smoking_habits", label: "Smoking Status", min: 0, max: 1, step: 1, icon: Cigarette, desc: "0 = No, 1 = Yes" },
  { key: "alcohol_consumption", label: "Alcohol (drinks/week)", min: 0, max: 14, step: 1, icon: Wine },
  { key: "stress_level", label: "Stress Level (1-10)", min: 1, max: 10, step: 1, icon: Activity },
  { key: "screen_time", label: "Screen Time (hours)", min: 1, max: 14, step: 0.5, icon: Smartphone },
  { key: "weight_change", label: "Weight Change (kg, last month)", min: -5, max: 10, step: 0.5, icon: TrendingUp },
  { key: "diet_quality", label: "Diet Quality Score (0-1)", min: 0, max: 1, step: 0.1, icon: Utensils },
];

const weeklyData = [
  { day: "Mon", score: 65, activity: 45 },
  { day: "Tue", score: 72, activity: 55 },
  { day: "Wed", score: 68, activity: 40 },
  { day: "Thu", score: 75, activity: 60 },
  { day: "Fri", score: 70, activity: 50 },
  { day: "Sat", score: 82, activity: 75 },
  { day: "Sun", score: 78, activity: 65 },
];

export default function LifestyleAnalytics() {
  const [formData, setFormData] = useState<Record<string, number>>({});
  const [result, setResult] = useState<LifestyleResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG.endpoints.lifestyle.predict, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 40) return "text-amber-400";
    return "text-rose-400";
  };

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Lifestyle Analytics
            </span>
          </h1>
          <p className="text-slate-400">Early diabetes risk prediction through behavioral patterns</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Lifestyle Data</h2>
                  <p className="text-xs text-slate-500">Behavioral patterns input</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {lifestyleInputs.map((input) => (
                  <div key={input.key}>
                    <label className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                      <input.icon className="w-4 h-4 text-violet-400" />
                      {input.label}
                    </label>
                    <input
                      type="number"
                      value={formData[input.key] ?? ""}
                      onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value))}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      className="w-full px-3 py-2 bg-white/5 border border-slate-700 rounded-lg text-white focus:border-violet-500 focus:outline-none"
                    />
                    {input.desc && <p className="text-xs text-slate-500 mt-1">{input.desc}</p>}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Patterns"}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {!result && (
              <div className="glass-card p-12 text-center">
                <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Pattern Analysis Ready</h3>
                <p className="text-slate-400">Enter your lifestyle data to predict early metabolic risks before clinical diagnosis</p>
              </div>
            )}

            {result && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div className="glass-card p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Risk Score</span>
                      <AlertTriangle className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(100 - result.risk_score)}`}>
                      {result.risk_score}%
                    </div>
                    <div className="text-sm text-slate-500 mt-2">{result.risk_level} Risk</div>
                  </div>

                  <div className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-400">Metabolic Score</span>
                      <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className={`text-5xl font-bold ${getScoreColor(result.metabolic_score)}`}>
                      {result.metabolic_score}
                    </div>
                    <div className="text-sm text-slate-500 mt-2">Out of 100</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Risk Factors Detected</h3>
                      <p className="text-sm text-slate-400">Behaviors that increase metabolic risk</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">{insight}</p>
                      </div>
                    ))}
                    {result.insights.length === 0 && (
                      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <p className="text-slate-300">No significant risk factors detected. Keep up the good work!</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {result.positive_feedback.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Positive Patterns</h3>
                        <p className="text-sm text-slate-400">Behaviors improving your health</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.positive_feedback.map((feedback, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-slate-300">{feedback}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend Analysis</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyData}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI Recommendation</h3>
                      <p className="text-sm text-slate-400">Personalized health advice</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20">
                    <p className="text-white font-medium">{result.recommendation}</p>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}