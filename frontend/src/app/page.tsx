"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  Heart, 
  Brain, 
  Watch, 
  Shield, 
  Sparkles,
  ArrowRight,
  Cpu,
  LineChart,
  Zap
} from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Clinical Prediction",
    description: "Input clinical data for AI-powered diabetes risk assessment with SHAP explainability",
    href: "/clinical",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: Brain,
    title: "Lifestyle Analytics",
    description: "Analyze behavioral patterns to predict early metabolic risks before clinical diagnosis",
    href: "/lifestyle",
    color: "from-violet-500 to-purple-600"
  },
  {
    icon: Watch,
    title: "Real-Time Monitoring",
    description: "Live smartwatch simulation with continuous health metrics streaming",
    href: "/realtime",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: LineChart,
    title: "AI Insights",
    description: "Smart health observations and personalized recommendations powered by AI",
    href: "/insights",
    color: "from-emerald-500 to-green-600"
  }
];

const stats = [
  { value: "87%", label: "Model Accuracy", icon: Cpu },
  { value: "253K+", label: "Training Samples", icon: Activity },
  { value: "<2s", label: "Prediction Time", icon: Zap },
  { value: "100%", label: "Explainable AI", icon: Shield },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#030712] to-[#030712]" />
        
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Early Risk Detection</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                DiaSense AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10">
              Intelligent early diabetes risk monitoring and prediction platform. 
              Combining clinical data, lifestyle analysis, and real-time health monitoring.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/clinical"
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-all duration-300"
              >
                <span>Try Prediction</span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <stat.icon className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Powerful AI Modules
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Comprehensive diabetes risk prediction through multiple intelligent modules
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="group block glass-card p-8 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-0.5 mb-6`}>
                  <div className="w-full h-full rounded-xl bg-[#030712] flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-10 rounded-2xl border border-amber-500/20">
          <div className="flex items-start gap-4">
            <Shield className="w-10 h-10 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Important Health Disclaimer
              </h3>
              <p className="text-slate-400 leading-relaxed">
                DiaSense AI is <strong>NOT</strong> a medical diagnosis tool. This system provides 
                AI-powered early diabetes risk estimation and lifestyle analytics for preventive 
                healthcare purposes only. Always consult with qualified healthcare professionals 
                for medical advice, diagnosis, and treatment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500">
            Built with Next.js, FastAPI, XGBoost & SHAP • DiaSense AI © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}