"use client";

import { useState, useEffect } from "react";
import { Activity, Heart, Brain, Wind } from "lucide-react";

interface VitalSetting {
  enabled: boolean;
  threshold: number;
}

interface VitalSigns {
  heartRate: number;
  respirationRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  breathingRate: number;
  stressLevel: string;
  activityLevel: string;
}

// Generate realistic vital signs with normal human ranges
const generateRealisticVitals = (): VitalSigns => {
  // Normal ranges for healthy adults
  const heartRate = Math.floor(Math.random() * (100 - 60) + 60); // 60-100 BPM
  const respirationRate = Math.floor(Math.random() * (20 - 12) + 12); // 12-20 breaths/min
  const bloodPressureSystolic = Math.floor(Math.random() * (140 - 110) + 110); // 110-140 mmHg
  const bloodPressureDiastolic = Math.floor(Math.random() * (90 - 70) + 70); // 70-90 mmHg
  const oxygenSaturation = Math.floor(Math.random() * (100 - 95) + 95); // 95-100%
  const breathingRate = Math.floor(Math.random() * (18 - 12) + 12); // 12-18 breaths/min (normal breathing rate)
  
  // Stress level based on heart rate and other factors
  const stressLevel = heartRate > 85 ? 'High' : heartRate > 75 ? 'Moderate' : 'Low';
  
  // Activity level based on heart rate
  const activityLevel = heartRate > 90 ? 'Very Active' : heartRate > 80 ? 'Active' : heartRate > 70 ? 'Light' : 'Resting';
  
  return {
    heartRate,
    respirationRate,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    oxygenSaturation,
    breathingRate,
    stressLevel,
    activityLevel
  };
};

export function RealTimeVitals() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [alertSettings, setAlertSettings] = useState<VitalSetting>({
    enabled: true,
    threshold: 85
  });
  const [vitals, setVitals] = useState<VitalSigns>(generateRealisticVitals());

  // Update vitals every 2 seconds continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(generateRealisticVitals());
    }, 2000); // Update every 2 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Check for high heart rate alerts
  useEffect(() => {
    if (alertSettings.enabled && vitals.heartRate > alertSettings.threshold) {
      if (notificationPermission === "granted") {
        new Notification("Heart Rate Alert", {
          body: `Heart rate is ${vitals.heartRate} BPM, above threshold of ${alertSettings.threshold} BPM`,
          icon: "/logo.png",
        });
      }
    }
  }, [vitals.heartRate, alertSettings, notificationPermission]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Get color based on stress level
  const getStressColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-white';
    }
  };

  // Get color based on activity level
  const getActivityColor = (level: string) => {
    switch (level) {
      case 'Very Active': return 'text-red-500';
      case 'Active': return 'text-blue-500';
      case 'Light': return 'text-green-500';
      case 'Resting': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Real-time Vitals</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-5 h-5 text-green-500 animate-pulse" />
          <div className="text-center">
            <h3 className="text-white font-medium">Live Monitoring</h3>
            <p className="text-gray-400 text-sm">
              Vitals updating every 2 seconds • Alerts enabled for heart rate above {alertSettings.threshold} BPM
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Heart Rate */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-500/20 p-2">
              <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Heart Rate</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-semibold text-white">{vitals.heartRate}</p>
                <p className="text-sm text-gray-400">BPM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/20 p-2">
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Blood Pressure</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl font-semibold text-white">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</p>
                <p className="text-sm text-gray-400">mmHg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Oxygen Saturation */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/20 p-2">
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Oxygen Saturation</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-semibold text-white">{vitals.oxygenSaturation}</p>
                <p className="text-sm text-gray-400">%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Respiration Rate */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Respiration Rate</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-semibold text-white">{vitals.respirationRate}</p>
                <p className="text-sm text-gray-400">/min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breathing Rate */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-500/20 p-2">
              <Wind className="w-5 h-5 text-teal-500 animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Breathing Rate</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-semibold text-white">{vitals.breathingRate}</p>
                <p className="text-sm text-gray-400">/min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Stress Level</p>
              <div className="flex items-baseline gap-1">
                <p className={`text-2xl font-semibold ${getStressColor(vitals.stressLevel)}`}>
                  {vitals.stressLevel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Level */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Activity Level</p>
              <p className={`text-lg font-semibold ${getActivityColor(vitals.activityLevel)}`}>
                {vitals.activityLevel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4">
        <h3 className="text-sm font-medium text-white mb-4">Alert Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Heart Rate Threshold</p>
              <p className="text-xs text-gray-400">Alert when exceeding</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={alertSettings.threshold}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  threshold: Math.max(60, Math.min(200, parseInt(e.target.value) || 85))
                }))}
                className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-center"
                min="60"
                max="200"
              />
              <span className="text-sm text-gray-400">BPM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 