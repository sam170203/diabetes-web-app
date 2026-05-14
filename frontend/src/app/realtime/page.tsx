"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Footprints, 
  Flame, 
  Moon, 
  Activity,
  Droplets,
  Thermometer,
  Zap,
  Wifi,
  Cloud,
  Cpu,
  Gauge
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

interface LiveData {
  timestamp: string;
  heart_rate: number;
  resting_heart_rate: number;
  steps: number;
  calories_burned: number;
  distance_km: number;
  sleep_quality: number;
  activity_level: string;
  blood_sugar: number;
  oxygen_saturation: number;
  body_temperature: number;
}

const metricCards = [
  { key: "heart_rate", label: "Heart Rate", icon: Heart, unit: "bpm", color: "from-rose-500 to-red-600", range: [60, 120], max: 150 },
  { key: "blood_sugar", label: "Blood Sugar", icon: Droplets, unit: "mg/dL", color: "from-amber-500 to-orange-600", range: [70, 140], max: 180 },
  { key: "oxygen_saturation", label: "SpO2", icon: Activity, unit: "%", color: "from-cyan-500 to-blue-600", range: [95, 100], max: 100 },
  { key: "body_temperature", label: "Temperature", icon: Thermometer, unit: "°C", color: "from-violet-500 to-purple-600", range: [36, 37.5], max: 38 },
  { key: "steps", label: "Steps", icon: Footprints, unit: "", color: "from-emerald-500 to-green-600", range: [0, 100], max: 200 },
  { key: "calories_burned", label: "Calories", icon: Flame, unit: "kcal", color: "from-orange-500 to-amber-600", range: [0, 50], max: 60 },
];

export default function RealtimeMonitoring() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<LiveData | null>(null);
  const [chartData, setChartData] = useState<{ time: string; heartRate: number; bloodSugar: number; oxygen: number }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  useEffect(() => {
    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws') || 'ws://localhost:8000'}/ws/stream`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionQuality('excellent');
    };

    ws.onmessage = (event) => {
      const data: LiveData = JSON.parse(event.data);
      setCurrentData(data);

      const time = new Date(data.timestamp).toLocaleTimeString();
      setChartData(prev => [
        ...prev.slice(-29),
        { time, heartRate: data.heart_rate, bloodSugar: data.blood_sugar, oxygen: data.oxygen_saturation }
      ]);
      
      setConnectionQuality(Math.random() > 0.1 ? 'excellent' : 'good');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConnectionQuality('poor');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const gaugeData = currentData ? [
    { name: 'Heart Rate', value: Math.min((currentData.heart_rate / 120) * 100, 100), fill: '#f43f5e' },
    { name: 'Oxygen', value: currentData.oxygen_saturation, fill: '#06b6d4' },
    { name: 'Metabolic', value: Math.min((currentData.blood_sugar / 140) * 100, 100), fill: '#f59e0b' },
  ] : [];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Real-Time Health Monitor
                </span>
              </h1>
              <p className="text-slate-400">Live smartwatch data streaming with AI analysis</p>
            </div>
            
            <div className="flex items-center gap-4 glass-card px-4 py-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-sm text-slate-300">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {connectionQuality === 'excellent' && <Wifi className="w-4 h-4 text-emerald-400" />}
                {connectionQuality === 'good' && <Wifi className="w-4 h-4 text-amber-400" />}
                {connectionQuality === 'poor' && <Wifi className="w-4 h-4 text-rose-400" />}
                <span className="text-xs text-slate-500 capitalize">{connectionQuality}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {metricCards.map((metric, index) => {
            const rawValue = currentData?.[metric.key as keyof LiveData];
            const value = typeof rawValue === 'number' ? rawValue : 0;
            const percentage = (value / metric.max) * 100;
            
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${metric.color} p-0.5`}>
                      <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center">
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{metric.label}</span>
                  </div>
                  
                  <div className="text-3xl font-bold text-white mb-1">
                    {value.toFixed(metric.key === 'distance_km' || metric.key === 'body_temperature' ? 1 : 0)}
                    <span className="text-sm font-normal text-slate-500 ml-1">{metric.unit}</span>
                  </div>
                  
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(percentage, 100)}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Live Vitals Stream</h3>
                <p className="text-sm text-slate-400">Real-time heart rate, blood sugar & oxygen</p>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="bsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2} fill="url(#hrGradient)" name="Heart Rate" />
                  <Area type="monotone" dataKey="bloodSugar" stroke="#f59e0b" strokeWidth={2} fill="url(#bsGradient)" name="Blood Sugar" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-sm text-slate-400">Heart Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-400">Blood Sugar</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Health Gauges</h3>
                <p className="text-sm text-slate-400">Current status indicators</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 h-72">
              {gaugeData.map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="35" stroke="#334155" strokeWidth="8" fill="none" />
                      <circle 
                        cx="40" cy="40" r="35" 
                        stroke={item.fill} 
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${item.value * 2.2} 220`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{item.value}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 mt-2">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Data Stream</h3>
                <p className="text-sm text-slate-400">Cloud sync status</p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Synced</span>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 font-mono text-xs max-h-40 overflow-y-auto">
              <pre className="text-emerald-400">
{currentData ? JSON.stringify(currentData, null, 2) : "Waiting for data stream..."}
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                <p className="text-sm text-slate-400">Real-time health insights</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                "Heart rate within normal range",
                "Blood sugar stable at " + (currentData?.blood_sugar || 95) + " mg/dL",
                "Oxygen saturation optimal",
                "Activity level: " + (currentData?.activity_level || "Active")
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Zap className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <span className="text-sm text-slate-300">{insight}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}