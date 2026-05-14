"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Info,
  Activity
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import API_CONFIG from "@/lib/config";

interface PredictionResult {
  prediction: number;
  risk_percentage: number;
  risk_level: string;
  feature_contributions: Array<{
    feature: string;
    value: number;
    contribution: number;
    impact: string;
  }>;
  top_insights: Array<{
    feature: string;
    contribution_pct: number;
    description: string;
  }>;
  model_info: {
    accuracy: number;
    dataset: string;
    samples: number;
  };
}

const clinicalInputs = [
  { key: "HighBP", label: "High Blood Pressure", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "HighChol", label: "High Cholesterol", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "BMI", label: "BMI (Body Mass Index)", min: 15, max: 60, step: 0.1, description: "Normal: 18.5-24.9" },
  { key: "Smoker", label: "Smoker", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "Stroke", label: "History of Stroke", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "HeartDiseaseorAttack", label: "Heart Disease/Attack", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "PhysActivity", label: "Physical Activity", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "Fruits", label: "Daily Fruit Consumption", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "Veggies", label: "Daily Vegetable Consumption", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "HvyAlcoholConsump", label: "Heavy Alcohol Consumption", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "GenHlth", label: "General Health (1-5)", min: 1, max: 5, step: 1, description: "1 = Excellent, 5 = Poor" },
  { key: "MentHlth", label: "Mental Health Days (0-30)", min: 0, max: 30, step: 1, description: "Days feeling bad" },
  { key: "PhysHlth", label: "Physical Health Days (0-30)", min: 0, max: 30, step: 1, description: "Days feeling bad" },
  { key: "DiffWalk", label: "Difficulty Walking", min: 0, max: 1, step: 1, description: "0 = No, 1 = Yes" },
  { key: "Sex", label: "Sex", min: 0, max: 1, step: 1, description: "0 = Female, 1 = Male" },
  { key: "Age", label: "Age (1-13)", min: 1, max: 13, step: 1, description: "1 = 18-24, 13 = 80+" },
  { key: "Education", label: "Education Level (1-6)", min: 1, max: 6, step: 1, description: "1 = Never, 6 = College" },
  { key: "Income", label: "Income Level (1-8)", min: 1, max: 8, step: 1, description: "1 = Low, 8 = High" },
];

export default function ClinicalPrediction() {
  const [formData, setFormData] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_CONFIG.endpoints.clinical.predict, {
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low": return "text-emerald-400";
      case "Medium": return "text-amber-400";
      case "High": return "text-rose-400";
      default: return "text-slate-400";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "Low": return "from-emerald-500/20 to-green-500/20";
      case "Medium": return "from-amber-500/20 to-orange-500/20";
      case "High": return "from-rose-500/20 to-red-500/20";
      default: return "from-slate-500/20 to-slate-500/20";
    }
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
            <span className="bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
              Clinical Prediction
            </span>
          </h1>
          <p className="text-slate-400">AI-powered diabetes risk assessment with explainable AI</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Clinical Data Input</h2>
                  <p className="text-xs text-slate-500">Enter health parameters</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {clinicalInputs.map((input) => (
                  <div key={input.key}>
                    <label className="block text-sm text-slate-300 mb-1">
                      {input.label}
                    </label>
                    <input
                      type="number"
                      value={formData[input.key] ?? ""}
                      onChange={(e) => handleInputChange(input.key, parseFloat(e.target.value))}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      className="w-full px-3 py-2 bg-white/5 border border-slate-700 rounded-lg text-white focus:border-rose-500 focus:outline-none"
                      placeholder={`${input.min}-${input.max}`}
                    />
                    <p className="text-xs text-slate-500 mt-1">{input.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-rose-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Analyzing..." : "Predict Risk"}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Shield className="w-4 h-4" />
                <span>Powered by XGBoost model trained on 253K samples</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {!result && (
              <div className="glass-card p-12 text-center">
                <Activity className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                <p className="text-slate-400">Enter your clinical data and click predict to get your diabetes risk assessment with AI-powered insights</p>
              </div>
            )}

            {result && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-6 bg-gradient-to-r ${getRiskBg(result.risk_level)}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Diabetes Risk Assessment</h3>
                      <p className="text-sm text-slate-400">AI Prediction Result</p>
                    </div>
                    <div className={`text-right ${getRiskColor(result.risk_level)}`}>
                      <div className="text-4xl font-bold">{result.risk_percentage}%</div>
                      <div className="text-sm">{result.risk_level} Risk</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg">
                    {result.risk_level === "Low" ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : result.risk_level === "Medium" ? (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400" />
                    )}
                    <p className="text-slate-300">{result.risk_level} risk detected based on clinical parameters</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                      <p className="text-sm text-slate-400">Key factors contributing to risk</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {result.top_insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="px-2 py-1 bg-rose-500/20 text-rose-400 text-sm font-medium rounded">
                          +{insight.contribution_pct}%
                        </div>
                        <p className="text-slate-300 text-sm">{insight.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={result.feature_contributions.slice(0, 10).map(fc => ({
                          feature: fc.feature,
                          contribution: Math.abs(fc.contribution) * 100,
                          isPositive: fc.contribution > 0
                        }))}
                        layout="vertical"
                      >
                        <XAxis type="number" stroke="#64748b" fontSize={10} />
                        <YAxis 
                          type="category" 
                          dataKey="feature" 
                          stroke="#64748b" 
                          fontSize={10}
                          width={120}
                          tickLine={false}
                        />
                        <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                          {result.feature_contributions.slice(0, 10).map((entry, index) => (
                            <Cell 
                              key={index} 
                              fill={entry.contribution > 0 ? "#f43f5e" : "#10b981"} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Model Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">{result.model_info.accuracy * 100}%</div>
                      <div className="text-sm text-slate-500">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-400">{result.model_info.dataset}</div>
                      <div className="text-sm text-slate-500">Dataset</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-violet-400">{result.model_info.samples.toLocaleString()}</div>
                      <div className="text-sm text-slate-500">Samples</div>
                    </div>
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