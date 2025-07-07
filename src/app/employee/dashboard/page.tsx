"use client";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { WellnessTrends } from "@/components/dashboard/wellness-trends";
import { RealTimeVitals } from "@/components/dashboard/real-time-vitals";
import { AIChatbot } from "@/components/dashboard/ai-chatbot";
import { BreathingSession } from "@/components/dashboard/breathing-session";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RealTimeVitals />
          <BreathingSession />
        </div>
        <div className="space-y-6">
          <WellnessTrends />
          <AIChatbot />
        </div>
      </div>
    </DashboardLayout>
  );
} 