"use client";

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface PermissionStatusProps {
  isLoading: boolean;
  isDone: boolean;
  onDone?: () => void;
}

export function PermissionStatus({ isLoading, isDone, onDone }: PermissionStatusProps) {
  const [show, setShow] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (isLoading || isDone) {
      setShow(true);
    }

    // If loading starts, show welcome message
    if (isLoading) {
      setShowWelcome(true);
    }

    // When loading is done, hide welcome message after 2 seconds
    if (!isLoading && isDone) {
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 2000);

      // Hide the status after showing "Done" for 4 seconds
      const doneTimer = setTimeout(() => {
        setShow(false);
        onDone?.();
      }, 4000);

      return () => {
        clearTimeout(welcomeTimer);
        clearTimeout(doneTimer);
      };
    }
  }, [isLoading, isDone, onDone]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-gray-900/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        {isLoading && showWelcome ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Welcome to CamVitals!</span>
              <span className="text-xs text-gray-400">Getting access to camera...</span>
            </div>
          </>
        ) : isDone ? (
          <>
            <Check className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">Done!</span>
          </>
        ) : null}
      </div>
    </div>
  );
} 