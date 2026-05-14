"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Watch, 
  Cloud, 
  Cpu, 
  Database, 
  Activity,
  ArrowRight,
  ArrowDown,
  Wifi,
  Bluetooth,
  Zap,
  Heart,
  Droplets,
  Footprints,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const mockData = [
  { time: '10:00', hr: 72, sugar: 95 },
  { time: '10:05', hr: 75, sugar: 98 },
  { time: '10:10', hr: 78, sugar: 102 },
  { time: '10:15', hr: 82, sugar: 105 },
  { time: '10:20', hr: 79, sugar: 100 },
  { time: '10:25', hr: 74, sugar: 96 },
];

const healthMetrics = [
  { icon: Heart, label: "Heart Rate", value: "78 bpm", color: "text-rose-400" },
  { icon: Droplets, label: "Blood Sugar", value: "98 mg/dL", color: "text-amber-400" },
  { icon: Activity, label: "SpO2", value: "98%", color: "text-cyan-400" },
  { icon: Footprints, label: "Steps", value: "1,247", color: "text-emerald-400" },
];

export default function Prototype() {
  const [streaming, setStreaming] = useState(false);
  const [dataPoints, setDataPoints] = useState(0);

  useEffect(() => {
    if (streaming) {
      const interval = setInterval(() => {
        setDataPoints(prev => prev + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [streaming]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Smart Watch Diabetes Monitor
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Real-time health data streaming from wearable device to AI-powered prediction engine
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 text-center relative"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
              >
                <Watch className="w-10 h-10 text-white" />
              </motion.div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Wearable Device</h3>
              <p className="text-slate-400 mb-4">Boat Smart Watch with SpO2, Heart Rate, Steps</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {healthMetrics.map((metric, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-3 bg-slate-800/50 rounded-lg"
                  >
                    <metric.icon className={`w-5 h-5 mx-auto mb-1 ${metric.color}`} />
                    <div className="text-sm font-semibold text-white">{metric.value}</div>
                    <div className="text-xs text-slate-500">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Bluetooth className="w-4 h-4 text-blue-400" />
                <span>BLE Connected</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 flex flex-col items-center justify-center"
          >
            <div className="relative h-full flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-4"
              >
                <Cloud className="w-8 h-8 text-white" />
              </motion.div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white">Cloud Pipeline</h3>
                <p className="text-sm text-slate-400">Real-time data streaming</p>
              </div>
              
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-cyan-400"
                  />
                ))}
              </div>
              
              {streaming && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-emerald-400"
                >
                  {dataPoints} data points streamed
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">AI Prediction Engine</h3>
              <p className="text-sm text-slate-400 mb-4">Real-time risk analysis</p>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData}>
                  <defs>
                    <linearGradient id="predictGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={8} />
                  <YAxis stroke="#64748b" fontSize={8} />
                  <Area type="monotone" dataKey="sugar" stroke="#10b981" strokeWidth={2} fill="url(#predictGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center mt-4">
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                Risk Score: Low (18%)
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Data Stream Simulation</h3>
            <button
              onClick={() => setStreaming(!streaming)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                streaming 
                  ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30" 
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {streaming ? "Stop Stream" : "Start Stream"}
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-slate-400">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {streaming ? "78" : "--"} <span className="text-sm text-slate-500">bpm</span>
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-400">Blood Sugar</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {streaming ? "98" : "--"} <span className="text-sm text-slate-500">mg/dL</span>
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-400">SpO2</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {streaming ? "98" : "--"} <span className="text-sm text-slate-500">%</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">How It Works</h3>
              <p className="text-slate-400">From your wrist to diabetes prediction</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Data Collection", desc: "Watch sensors capture vitals", icon: Watch },
              { step: 2, title: "BLE Transfer", desc: "Bluetooth sends to phone", icon: Wifi },
              { step: 3, title: "Cloud Sync", desc: "Data uploads in real-time", icon: Cloud },
              { step: 4, title: "AI Analysis", desc: "Predicts diabetes risk", icon: Cpu },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{item.step}. {item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <p className="text-slate-500 text-sm">
            🔬 <span className="text-violet-400">Research Prototype</span> - Data shown is simulation for demonstration purposes
          </p>
        </motion.div>
      </div>
    </div>
  );
}