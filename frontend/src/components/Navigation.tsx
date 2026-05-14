"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Activity, 
  Heart, 
  Watch, 
  Brain, 
  FileText,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/clinical", label: "Clinical", icon: Heart },
  { href: "/lifestyle", label: "Lifestyle", icon: Brain },
  { href: "/realtime", label: "Real-Time", icon: Watch },
  { href: "/insights", label: "Insights", icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-emerald-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-emerald-400" />
              <div className="absolute inset-0 bg-emerald-400/30 blur-lg rounded-full" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              DiaSense AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-500">AI Active</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}