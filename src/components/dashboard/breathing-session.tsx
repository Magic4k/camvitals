"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

export function BreathingSession() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          // Change breath phase every 4 seconds
          if (newSeconds % 4 === 0) {
            setBreathPhase((prev) => {
              if (prev === "inhale") return "hold";
              if (prev === "hold") return "exhale";
              return "inhale";
            });
          }
          return newSeconds;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setSeconds(0);
    setBreathPhase("inhale");
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Breathing Session</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSession}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </button>
          <button
            onClick={resetSession}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl font-bold text-white">{formatTime(seconds)}</div>
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${
            breathPhase === "inhale"
              ? "bg-blue-500/20 scale-110"
              : breathPhase === "hold"
              ? "bg-purple-500/20 scale-100"
              : "bg-green-500/20 scale-90"
          }`}
        >
          <span className="text-white text-lg capitalize">{breathPhase}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Breaths</p>
          <p className="text-xl font-semibold text-white">{Math.floor(seconds / 12)}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Cycles</p>
          <p className="text-xl font-semibold text-white">{Math.floor(seconds / 36)}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <p className="text-sm text-gray-400">Focus Score</p>
          <p className="text-xl font-semibold text-white">
            {isActive ? Math.min(100, Math.floor(seconds / 2)) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
} 