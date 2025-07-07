"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Bot, Camera, Moon, Sun } from "lucide-react";

interface TimeRange {
  start: string;
  end: string;
}

export function UserSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [cameraConsent, setCameraConsent] = useState(true);
  const [dndTimeRange, setDndTimeRange] = useState<TimeRange>({
    start: "22:00",
    end: "06:00",
  });

  const handleSave = () => {
    // Save settings to backend
    console.log("Settings saved:", {
      notificationsEnabled,
      chatbotEnabled,
      cameraConsent,
      dndTimeRange,
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Notification Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Enable Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {notificationsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-8 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Do Not Disturb Hours</span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="time"
                  value={dndTimeRange.start}
                  onChange={(e) =>
                    setDndTimeRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={dndTimeRange.end}
                  onChange={(e) =>
                    setDndTimeRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Assistant Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Assistant Settings
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Enable AI Chatbot</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={chatbotEnabled}
              onChange={(e) => setChatbotEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-gray-500" />
            <div className="space-y-1">
              <span className="text-gray-700 block">Camera Access</span>
              <span className="text-sm text-gray-500 block">
                Required for vitals monitoring
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={cameraConsent}
              onChange={(e) => setCameraConsent(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
} 