"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { WellnessTrends } from "@/components/dashboard/wellness-trends";
import { Activity, Brain, Heart, Moon, Sun, Zap } from "lucide-react";

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

export default function MetricsPage() {
  const dailyMetrics: MetricCard[] = [
    {
      title: "Average Heart Rate",
      value: "72 BPM",
      change: 2.5,
      icon: Heart,
      color: "rose",
    },
    {
      title: "Stress Level",
      value: "Low",
      change: -15,
      icon: Brain,
      color: "purple",
    },
    {
      title: "Focus Score",
      value: "85%",
      change: 5,
      icon: Zap,
      color: "amber",
    },
    {
      title: "Activity Level",
      value: "Active",
      change: 10,
      icon: Activity,
      color: "blue",
    },
    {
      title: "Sleep Quality",
      value: "7.5h",
      change: 12,
      icon: Moon,
      color: "indigo",
    },
    {
      title: "Energy Level",
      value: "High",
      change: 8,
      icon: Sun,
      color: "orange",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">Wellness Metrics</h1>
          <div className="flex items-center gap-4">
            <select className="bg-white/5 text-white border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Daily Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className={`rounded-lg bg-${metric.color}-500/20 p-3`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-500`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">{metric.title}</h3>
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className={`text-sm ${
                        metric.change >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {metric.change >= 0 ? "+" : ""}
                      {metric.change}%
                    </span>
                    <span className="text-sm text-gray-400">vs. last period</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Trends */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Detailed Trends</h2>
          <WellnessTrends />
        </div>

        {/* Recommendations Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Wellness Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-500/20 p-2">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">Optimal Performance Time</h3>
                <p className="text-gray-400">Your focus peaks between 9 AM and 11 AM. Schedule important tasks during this window.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <Brain className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">Stress Management</h3>
                <p className="text-gray-400">Consider taking short breaks every 90 minutes to maintain lower stress levels.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Moon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-white font-medium">Sleep Pattern</h3>
                <p className="text-gray-400">Your sleep quality has improved. Maintain your current bedtime routine.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 