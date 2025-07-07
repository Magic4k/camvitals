import { ReactNode } from 'react';

interface HeartbeatBackgroundProps {
  children: ReactNode;
}

export default function HeartbeatBackground({ children }: HeartbeatBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-[url('/heartbeat.svg')] bg-center bg-no-repeat animate-heartbeat" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 