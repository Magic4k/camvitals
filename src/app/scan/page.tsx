"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera, RefreshCw, Info } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestCameraPermission();
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    // Simulate a scan process
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to dashboard after scan
      window.location.href = "/employee/dashboard";
    }, 30000); // 30 seconds scan
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900/50 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/employee/dashboard" className="text-white hover:text-gray-300">
            ← Back to Dashboard
          </Link>
          <button
            onClick={requestCameraPermission}
            className="flex items-center gap-2 text-white hover:text-gray-300"
          >
            <RefreshCw className="w-5 h-5" />
            Recalibrate Camera
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Instructions */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-4">How to take assessment</h1>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">1</span>
                <p>Ensure good lighting for clear visibility.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">2</span>
                <p>Position your device's camera so it's level with your eyes.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm">3</span>
                <p>Avoid talking or moving your head.</p>
              </div>
            </div>
          </div>

          {/* Camera View */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-8">
            {hasPermission === false && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Camera access denied.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Please enable camera access in your browser settings.
                  </p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Scan Frame Overlay */}
            <div className="absolute inset-0 border-[3px] border-red-500/50 m-8">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <button
              onClick={startScan}
              disabled={!hasPermission || isScanning}
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <span className="inline-block animate-pulse">Scanning...</span>
                  <span className="block text-sm mt-1">Please remain still</span>
                </>
              ) : (
                "START"
              )}
            </button>
          </div>

          {/* Health Metrics */}
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Measurements</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Heart Rate</div>
                <div className="text-lg font-semibold mt-1">-- BPM</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Blood Pressure</div>
                <div className="text-lg font-semibold mt-1">-- / --</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Breathing Rate</div>
                <div className="text-lg font-semibold mt-1">-- BPM</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Stress Level</div>
                <div className="text-lg font-semibold mt-1">--%</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 