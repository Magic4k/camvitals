"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Activity, Brain, Heart, Moon, Sun, TrendingUp, Calendar, Clock, Battery, Zap, ChevronDown } from "lucide-react";

interface AnalyticsCard {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"1W" | "1M" | "3M" | "6M" | "1Y">("1M");
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);

  const timeRangeOptions = [
    { value: "1W", label: "Last Week" },
    { value: "1M", label: "Last Month" },
    { value: "3M", label: "Last 3 Months" },
    { value: "6M", label: "Last 6 Months" },
    { value: "1Y", label: "Last Year" },
  ];

  useEffect(() => {
    setMounted(true);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.time-range-dropdown')) {
        setIsTimeRangeOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const analyticsCards: AnalyticsCard[] = [
    {
      title: "Wellness Score",
      value: "85/100",
      change: 5,
      trend: "up",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "Focus Time",
      value: "6.5 hrs",
      change: 12,
      trend: "up",
      icon: Brain,
      color: "purple",
    },
    {
      title: "Avg Heart Rate",
      value: "72 BPM",
      change: -3,
      trend: "down",
      icon: Heart,
      color: "rose",
    },
    {
      title: "Sleep Quality",
      value: "92%",
      change: 8,
      trend: "up",
      icon: Moon,
      color: "blue",
    },
  ];

  const wellnessBreakdown: ChartData[] = [
    { name: "Physical", value: 85, color: "#ef4444" },
    { name: "Mental", value: 78, color: "#8b5cf6" },
    { name: "Emotional", value: 92, color: "#3b82f6" },
    { name: "Social", value: 70, color: "#10b981" },
  ];

  const getRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const dailyPatternData = [
    { time: "6AM", energy: getRandomInRange(50, 70), focus: getRandomInRange(45, 65), productivity: getRandomInRange(45, 60) },
    { time: "9AM", energy: getRandomInRange(75, 95), focus: getRandomInRange(75, 90), productivity: getRandomInRange(70, 85) },
    { time: "12PM", energy: getRandomInRange(65, 85), focus: getRandomInRange(60, 80), productivity: getRandomInRange(60, 75) },
    { time: "3PM", energy: getRandomInRange(60, 75), focus: getRandomInRange(55, 70), productivity: getRandomInRange(55, 70) },
    { time: "6PM", energy: getRandomInRange(65, 80), focus: getRandomInRange(60, 75), productivity: getRandomInRange(60, 75) },
    { time: "9PM", energy: getRandomInRange(50, 65), focus: getRandomInRange(45, 60), productivity: getRandomInRange(45, 60) },
  ];

  const weeklyTrendData = [
    { day: "Mon", stress: getRandomInRange(30, 50), energy: getRandomInRange(70, 90), focus: getRandomInRange(65, 85) },
    { day: "Tue", stress: getRandomInRange(35, 55), energy: getRandomInRange(65, 85), focus: getRandomInRange(60, 80) },
    { day: "Wed", stress: getRandomInRange(25, 45), energy: getRandomInRange(75, 90), focus: getRandomInRange(70, 85) },
    { day: "Thu", stress: getRandomInRange(30, 50), energy: getRandomInRange(65, 85), focus: getRandomInRange(60, 80) },
    { day: "Fri", stress: getRandomInRange(20, 40), energy: getRandomInRange(75, 95), focus: getRandomInRange(70, 90) },
    { day: "Sat", stress: getRandomInRange(20, 35), energy: getRandomInRange(70, 90), focus: getRandomInRange(65, 85) },
    { day: "Sun", stress: getRandomInRange(20, 35), energy: getRandomInRange(65, 85), focus: getRandomInRange(60, 80) },
  ];

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Wellness Analytics</h1>
          <div className="relative time-range-dropdown">
            <button
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{timeRangeOptions.find(opt => opt.value === timeRange)?.label}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isTimeRangeOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTimeRangeOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-900 rounded-lg shadow-xl border border-white/10 z-10">
                {timeRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeRange(option.value as typeof timeRange);
                      setIsTimeRangeOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-white/5 transition-colors ${
                      timeRange === option.value
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsCards.map((card) => (
            <div
              key={card.title}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg bg-${card.color}-500/20 p-3`}>
                  <card.icon className={`w-6 h-6 text-${card.color}-500`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{card.title}</h3>
                  <p className="text-2xl font-semibold text-white">{card.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        card.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        card.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {card.change}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Pattern Chart */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Daily Pattern</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyPatternData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="energy" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="focus" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="productivity" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Trends Chart */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Weekly Trends</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="stress" fill="#ef4444" />
                  <Bar dataKey="energy" fill="#8b5cf6" />
                  <Bar dataKey="focus" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Wellness Breakdown */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Wellness Breakdown</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wellnessBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {wellnessBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Key Insights</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Peak Performance</h3>
                  <p className="text-gray-400">Your productivity peaks between 9 AM and 11 AM. Schedule important tasks during this window.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-purple-500/20 p-2">
                  <Battery className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Energy Management</h3>
                  <p className="text-gray-400">Energy levels are highest early in the week. Consider scheduling demanding tasks for these days.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Break Optimization</h3>
                  <p className="text-gray-400">Taking breaks every 90 minutes has shown to improve your focus scores by 15%.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-rose-500/20 p-2">
                  <Zap className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Stress Patterns</h3>
                  <p className="text-gray-400">Stress levels are lowest during weekends and early mornings. Consider meditation during high-stress periods.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 