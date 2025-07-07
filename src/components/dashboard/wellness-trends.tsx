"use client";

import { useState, useEffect } from "react";
import { Activity, Brain, Heart, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type TimeRange = "1D" | "1W" | "1M" | "6M";

interface WellnessMetric {
  timestamp: string;
  heartRate: number;
  stressLevel: number;
  focusScore: number;
}

const timeRangeOptions = [
  { label: "1D", value: "1D" },
  { label: "1W", value: "1W" },
  { label: "1M", value: "1M" },
  { label: "6M", value: "6M" },
];

const generateMockData = (timeRange: TimeRange): WellnessMetric[] => {
  const data: WellnessMetric[] = [];
  const now = new Date();
  let points: number;
  let interval: number;

  switch (timeRange) {
    case "1D":
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case "1W":
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "1M":
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "6M":
      points = 180;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      points = 24;
      interval = 60 * 60 * 1000;
  }

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval);
    data.push({
      timestamp: timestamp.toISOString(),
      heartRate: Math.floor(65 + Math.random() * 20),
      stressLevel: Math.floor(20 + Math.random() * 60),
      focusScore: Math.floor(70 + Math.random() * 30),
    });
  }

  return data;
};

const generateNewDataPoint = (): WellnessMetric => {
  return {
    timestamp: new Date().toISOString(),
    heartRate: Math.floor(65 + Math.random() * 20),
    stressLevel: Math.floor(20 + Math.random() * 60),
    focusScore: Math.floor(70 + Math.random() * 30),
  };
};

const formatXAxis = (timestamp: string, timeRange: TimeRange) => {
  const date = new Date(timestamp);
  switch (timeRange) {
    case "1D":
      return date.toLocaleTimeString([], { hour: "2-digit" });
    case "1W":
      return date.toLocaleDateString([], { weekday: "short" });
    case "1M":
      return date.toLocaleDateString([], { day: "2-digit" });
    case "6M":
      return date.toLocaleDateString([], { month: "short" });
    default:
      return timestamp;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 shadow-lg border border-white/20">
        <p className="text-gray-300 text-sm mb-2">
          {new Date(label).toLocaleDateString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
            {entry.name === "Heart Rate" ? " bpm" : "%"}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WellnessTrends() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [data, setData] = useState<WellnessMetric[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(generateMockData(timeRange));
  }, [timeRange]);

  // Real-time updates every 2 seconds for 1D view
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeRange === "1D") {
      interval = setInterval(() => {
        setData(prevData => {
          const newDataPoint = generateNewDataPoint();
          const updatedData = [...prevData, newDataPoint];
          
          // Keep only the last 24 hours of data for 1D view
          if (updatedData.length > 24) {
            return updatedData.slice(-24);
          }
          
          return updatedData;
        });
      }, 2000); // Update every 2 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeRange]);

  if (!mounted) return null;

  const metrics = [
    { name: "Heart Rate", key: "heartRate", color: "#ef4444", icon: Heart },
    { name: "Stress Level", key: "stressLevel", color: "#8b5cf6", icon: Brain },
    { name: "Focus Score", key: "focusScore", color: "#3b82f6", icon: Activity },
  ];

  const currentMetrics = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Wellness Trends</h2>
        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as TimeRange)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                  timeRange === option.value
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const value = Number(currentMetrics?.[metric.key as keyof WellnessMetric]) || 0;
          const prevValue = Number(data[data.length - 2]?.[metric.key as keyof WellnessMetric]) || 0;
          const change = prevValue !== 0 ? ((value - prevValue) / prevValue) * 100 : 0;

          return (
            <div key={metric.key} className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg p-2" style={{ backgroundColor: `${metric.color}20` }}>
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{metric.name}</p>
                  <p className="text-lg font-semibold text-white">
                    {value}
                    {metric.key === "heartRate" ? " BPM" : "%"}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                <TrendingUp className="w-4 h-4" />
                <span>{change >= 0 ? "+" : ""}{change.toFixed(1)}% from previous</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => formatXAxis(value, timeRange)}
              stroke="#6B7280"
              tick={{ fill: "#6B7280" }}
            />
            <YAxis stroke="#6B7280" tick={{ fill: "#6B7280" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
            {metrics.map((metric) => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                name={metric.name}
                stroke={metric.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 