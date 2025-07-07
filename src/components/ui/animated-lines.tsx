"use client";

import React from "react";

export const AnimatedLines = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal lines */}
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-b from-transparent via-blue-200/30 to-transparent transform rotate-45 animate-slide"></div>
        <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-gradient-to-b from-transparent via-blue-100/20 to-transparent transform rotate-[135deg] animate-slide-reverse"></div>
        
        {/* Horizontal lines */}
        <div className="absolute w-full h-full bg-[linear-gradient(0deg,transparent_24%,rgba(59,130,246,0.08)_25%,rgba(59,130,246,0.08)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.08)_75%,rgba(59,130,246,0.08)_76%,transparent_77%,transparent)] bg-[length:40px_40px] animate-slide-horizontal"></div>
        
        {/* Vertical lines */}
        <div className="absolute w-full h-full bg-[linear-gradient(90deg,transparent_24%,rgba(59,130,246,0.08)_25%,rgba(59,130,246,0.08)_26%,transparent_27%,transparent_74%,rgba(59,130,246,0.08)_75%,rgba(59,130,246,0.08)_76%,transparent_77%,transparent)] bg-[length:40px_40px] animate-slide-vertical"></div>
      </div>
    </div>
  );
}; 