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
  Zap
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
import API_CONFIG from "@/lib/config";

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
  { key: "heart_rate", label: "Heart Rate", icon: Heart, unit: "bpm", color: "from-rose-500 to-red-600", range: [60, 120] },
  { key: "resting_heart_rate", label: "Resting HR", icon: Heart, unit: "bpm", color: "from-pink-500 to-rose-600", range: [45, 80] },
  { key: "steps", label: "Steps", icon: Footprints, unit: "", color: "from-cyan-500 to-blue-600", range: [0, 100] },
  { key: "calories_burned", label: "Calories", icon: Flame, unit: "kcal", color: "from-orange-500 to-amber-600", range: [0, 50] },
  { key: "distance_km", label: "Distance", icon: Footprints, unit: "km", color: "from-emerald-500 to-green-600", range: [0, 0.3] },
  { key: "sleep_quality", label: "Sleep Quality", icon: Moon, unit: "%", color: "from-violet-500 to-purple-600", range: [60, 100] },
  { key: "blood_sugar", label: "Blood Sugar", icon: Droplets, unit: "mg/dL", color: "from-amber-500 to-orange-600", range: [70, 140] },
  { key: "oxygen_saturation", label: "SpO2", icon: Activity, unit: "%", color: "from-sky-500 to-blue-600", range: [95, 100] },
  { key: "body_temperature", label: "Temperature", icon: Thermometer, unit: "°C", color: "from-amber-500 to-yellow-600", range: [36, 37.5] },
];

export default function RealtimeMonitoring() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<LiveData | null>(null);
  const [chartData, setChartData] = useState<{ time: string; heartRate: number; bloodSugar: number }[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(API_CONFIG.endpoints.websocket.stream);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data: LiveData = JSON.parse(event.data);
      setCurrentData(data);

      const time = new Date(data.timestamp).toLocaleTimeString();
      setChartData(prev => [
        ...prev.slice(-29),
        { time, heartRate: data.heart_rate, bloodSugar: data.blood_sugar }
      ]);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Real-Time Monitoring
                </span>
              </h1>
              <p className="text-slate-400">Live smartwatch simulation with continuous health metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
              <span className="text-sm text-slate-400">
                {isConnected ? "Live Stream Active" : "Connecting..."}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {metricCards.map((metric, index) => {
            const rawValue = currentData?.[metric.key as keyof LiveData];
            const value = typeof rawValue === 'number' ? rawValue : 0;
            const isNormal = typeof rawValue === 'number' && value >= metric.range[0] && value <= metric.range[1];
            
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${metric.color} p-0.5`}>
                    <div className="w-full h-full rounded-lg bg-[#030712] flex items-center justify-center">
                      <metric.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isNormal ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                </div>
                <div className="text-2xl font-bold text-white">
                  {typeof value === "number" ? value.toFixed(metric.key === "distance_km" || metric.key === "body_temperature" ? 1 : 0) : value}
                  <span className="text-sm font-normal text-slate-500 ml-1">{metric.unit}</span>
                </div>
                <div className="text-sm text-slate-500">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Heart Rate Stream</h3>
                <p className="text-sm text-slate-400">Real-time BPM monitoring</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[50, 130]} />
                  <Line 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#f43f5e" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Blood Sugar Stream</h3>
                <p className="text-sm text-slate-400">Real-time glucose monitoring</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="bsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[60, 160]} />
                  <Area 
                    type="monotone" 
                    dataKey="bloodSugar" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    fill="url(#bsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Live Data Feed</h3>
              <p className="text-sm text-slate-400">WebSocket real-time streaming</p>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm max-h-48 overflow-y-auto">
            <pre className="text-slate-400">
              {currentData ? JSON.stringify(currentData, null, 2) : "Waiting for data..."}
            </pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}