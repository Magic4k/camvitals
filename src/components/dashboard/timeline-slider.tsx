"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Wind } from "lucide-react";

interface VitalsSnapshot {
  timestamp: Date;
  heartRate: number;
  respirationRate: number;
}

// Mock data - Replace with real API data
const generateMockSnapshots = () => {
  const snapshots: VitalsSnapshot[] = [];
  const now = new Date();
  
  for (let i = 0; i < 60; i++) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000); // 30 minutes intervals
    snapshots.push({
      timestamp,
      heartRate: Math.floor(Math.random() * (100 - 60) + 60),
      respirationRate: Math.floor(Math.random() * (20 - 12) + 12),
    });
  }
  
  return snapshots.reverse();
};

export function TimelineSlider() {
  const [snapshots, setSnapshots] = useState<VitalsSnapshot[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const data = generateMockSnapshots();
    setSnapshots(data);
    setSelectedIndex(data.length - 1);
  }, []);

  if (!isClient || snapshots.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="animate-pulse">
            <div className="bg-red-50 rounded-xl p-4">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-2 w-full bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const selectedSnapshot = snapshots[selectedIndex];

  const formatTime = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Selection Display */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="bg-red-50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-700">Heart Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {selectedSnapshot.heartRate}
            <span className="text-base font-normal text-gray-500 ml-1">BPM</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-blue-50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Respiration Rate
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {selectedSnapshot.respirationRate}
            <span className="text-base font-normal text-gray-500 ml-1">
              breaths/min
            </span>
          </div>
        </motion.div>
      </div>

      {/* Timeline Slider */}
      <div className="space-y-4">
        <input
          type="range"
          min={0}
          max={snapshots.length - 1}
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {formatTime(snapshots[0].timestamp)}
          </span>
          <span>
            {formatTime(snapshots[snapshots.length - 1].timestamp)}
          </span>
        </div>
      </div>

      {/* Time Markers */}
      <div className="flex justify-between text-sm text-gray-500 overflow-x-auto">
        {snapshots
          .filter((_, index) => index % 12 === 0) // Show every 6 hours
          .map((snapshot, index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[100px]"
              onClick={() => setSelectedIndex(index * 12)}
            >
              <div
                className={`h-2 w-2 rounded-full mb-1 ${
                  selectedIndex === index * 12
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
              <span className="text-xs">
                {formatTime(snapshot.timestamp)}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
} 