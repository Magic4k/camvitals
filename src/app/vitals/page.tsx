"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Droplets,
  Brain,
  Scale,
  Zap,
  Shield,
  Target,
  ChevronDown,
  Play,
  ArrowLeft,
  Settings,
  Monitor,
} from "lucide-react";

const HealthAssessmentUI = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedScenario, setSelectedScenario] = useState("Health Assessment");
  
  // Camera and process states
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [processState, setProcessState] = useState<'opening' | 'countdown' | 'calculating' | 'complete'>('opening');
  const [countdown, setCountdown] = useState(5);
  const [calculationTime, setCalculationTime] = useState(4);
  
  // Vitals data
  const [vitals, setVitals] = useState({
    heartRate: 0,
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    oxygenSaturation: 0
  });

  const scenarios = [
    "Health Assessment",
    "Fitness Evaluation",
    "Stress Analysis",
    "Wellness Check"
  ];

  const healthMetrics = [
    { name: "Heart Rate", icon: Heart, color: "text-red-400", bgColor: "bg-red-500/10" },
    { name: "Breathing Rate", icon: Wind, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { name: "Blood Pressure", icon: Activity, color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { name: "Body Mass Index", icon: Scale, color: "text-green-400", bgColor: "bg-green-500/10" },
    { name: "Heart Rate Variability", icon: Zap, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
    { name: "Cardiac Stress Index", icon: Shield, color: "text-orange-400", bgColor: "bg-orange-500/10" },
    { name: "Parasympathetic Activity", icon: Brain, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
    { name: "Wellness Score", icon: Target, color: "text-pink-400", bgColor: "bg-pink-500/10" },
  ];

  // Generate random realistic vitals
  const generateVitals = () => {
    return {
      heartRate: Math.floor(Math.random() * 41) + 60, // 60-100
      bloodPressureSystolic: Math.floor(Math.random() * 21) + 110, // 110-130
      bloodPressureDiastolic: Math.floor(Math.random() * 21) + 70, // 70-90
      oxygenSaturation: Math.floor(Math.random() * 6) + 95 // 95-100
    };
  };

  // Camera setup and process flow
  useEffect(() => {
    const setupCamera = async () => {
      try {
        setProcessState('opening');
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            setCameraReady(true);
            // Start countdown after camera is ready
            setProcessState('countdown');
          };
        }
      } catch (error) {
        console.error('Camera error:', error);
        setCameraError('Camera access denied or not available');
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (processState === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (processState === 'countdown' && countdown === 0) {
      setProcessState('calculating');
      setCalculationTime(4);
    }
  }, [processState, countdown]);

  // Calculation timer
  useEffect(() => {
    if (processState === 'calculating' && calculationTime > 0) {
      const timer = setTimeout(() => {
        setCalculationTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (processState === 'calculating' && calculationTime === 0) {
      setProcessState('complete');
      setVitals(generateVitals());
    }
  }, [processState, calculationTime]);

  // Update vitals every 2 seconds when complete
  useEffect(() => {
    if (processState === 'complete') {
      const interval = setInterval(() => {
        setVitals(generateVitals());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [processState]);

  const retryCamera = () => {
    setCameraError(null);
    setCameraReady(false);
    setProcessState('opening');
    setCountdown(5);
    setCalculationTime(4);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Professional Header */}
      <div className="bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    Health Assessment
                  </h1>
                  <p className="text-xs text-gray-400">
                    AI-Powered Vital Signs Analysis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  processState === 'complete' ? 'bg-green-500' : 'bg-primary animate-pulse'
                }`} />
                <span className={`text-sm font-medium ${
                  processState === 'complete' ? 'text-green-400' : 'text-primary'
                }`}>
                  {processState === 'opening' && 'Opening Camera'}
                  {processState === 'countdown' && 'Starting Scan'}
                  {processState === 'calculating' && 'Analyzing'}
                  {processState === 'complete' && 'Live Monitoring'}
                </span>
              </div>
              <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Instructions Panel */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-white">
                How to take assessment
              </h2>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-base font-semibold">
                  1
                </div>
                <p className="text-gray-300 text-base">
                  Ensure good lighting for clear visibility.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-base font-semibold">
                  2
                </div>
                <p className="text-gray-300 text-base">
                  Position your device's camera so it's level with your eyes.
                </p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-base font-semibold">
                  3
                </div>
                <p className="text-gray-300 text-base">
                  Avoid talking or moving your head during the scan.
                </p>
              </div>
            </div>

            {/* Dropdown */}
            <div className="mb-8">
              <label className="block text-base font-medium text-gray-300 mb-3">
                Apply in various scenarios
              </label>
              <div className="relative">
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl px-5 py-3 pr-10 text-base text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario} value={scenario} className="bg-gray-700">
                      {scenario}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <p className="text-base text-gray-400 leading-relaxed">
              This health assessment uses rPPG, computer vision, and advanced AI to build a full profile of your health markers. The scan will start automatically once your camera is ready.
            </p>
          </div>

          {/* Center Column - Camera Feed & Controls */}
          <div className="space-y-8">
            {/* Video Feed */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                
                {cameraError ? (
                  /* Error State */
                  <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Monitor className="w-10 h-10 text-gray-500" />
                      </div>
                      <p className="text-gray-400 text-xl mb-3">Camera Error</p>
                      <p className="text-gray-500 text-base mb-4">{cameraError}</p>
                      <button
                        onClick={retryCamera}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                      >
                        Retry Camera
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Video Element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Corner Markers - show when camera is ready */}
                    {cameraReady && processState === 'complete' && (
                      <>
                        <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-green-500 animate-pulse"></div>
                        <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-green-500 animate-pulse"></div>
                        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-green-500 animate-pulse"></div>
                        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-green-500 animate-pulse"></div>
                      </>
                    )}
                    
                    {/* Opening Camera Overlay */}
                    {processState === 'opening' && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center transition-opacity duration-500">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Monitor className="w-10 h-10 text-primary" />
                          </div>
                          <p className="text-white text-2xl font-semibold mb-3">Opening camera…</p>
                          <p className="text-gray-300 text-base">Please allow camera access</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Countdown Overlay */}
                    {processState === 'countdown' && cameraReady && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-500">
                        <div className="text-center">
                          <div className="w-40 h-40 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                            <span className="text-8xl font-bold text-white">{countdown}</span>
                          </div>
                          <p className="text-white text-2xl font-semibold mb-3">Starting scan...</p>
                          <p className="text-gray-300 text-base">Please remain still</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Calculating Overlay */}
                    {processState === 'calculating' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-500">
                        <div className="text-center">
                          <div className="w-40 h-40 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center mb-6 animate-spin">
                            <Heart className="w-16 h-16 text-primary" />
                          </div>
                          <p className="text-white text-2xl font-semibold mb-3">Calculating vitals…</p>
                          <p className="text-gray-300 text-base">Analyzing your health markers</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Vitals Cards - Only show when complete */}
            {processState === 'complete' && (
              <div className="grid grid-cols-1 gap-6">
                {/* Heart Rate */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-white">{vitals.heartRate}</div>
                      <div className="text-sm text-gray-400 font-medium">BPM</div>
                    </div>
                  </div>
                  <div className="text-base text-gray-400 font-medium">HEART RATE</div>
                </div>

                {/* Blood Pressure */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-white">{vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}</div>
                      <div className="text-sm text-gray-400 font-medium">mmHg</div>
                    </div>
                  </div>
                  <div className="text-base text-gray-400 font-medium">BLOOD PRESSURE</div>
                </div>

                {/* Oxygen Saturation */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center transform transition-all duration-500 hover:scale-105">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Droplets className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-3xl font-bold text-white">{vitals.oxygenSaturation}%</div>
                      <div className="text-sm text-gray-400 font-medium">SpO₂</div>
                    </div>
                  </div>
                  <div className="text-base text-gray-400 font-medium">OXYGEN SATURATION</div>
                </div>
              </div>
            )}

            {/* Footer Text */}
            <p className="text-center text-base text-gray-400">
              {processState === 'complete' 
                ? 'Vitals updating every 2 seconds' 
                : 'Position your face in front of the camera'
              }
            </p>
          </div>

          {/* Right Column - Metrics Panel */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Monitor 30+ Health Metrics
                </h2>
                <p className="text-sm text-gray-400">
                  Real-time facial scan analysis
                </p>
              </div>
            </div>

            <p className="text-base text-gray-400 leading-relaxed">
              Measure health markers like blood pressure, BMI, heart rate (HR), heart rate variability (HRV) and more in real-time via face scan technology.
            </p>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {healthMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl p-4 hover:bg-gray-700/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm leading-tight">
                          {metric.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* More Metrics Link */}
            <div className="text-center pt-6 border-t border-gray-700">
              <button className="text-primary hover:text-primary/80 font-medium text-base transition-colors">
                +25 More Health Markers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessmentUI; 