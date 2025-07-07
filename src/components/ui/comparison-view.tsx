'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  hoverImage: string;
}

const leftCards: FeatureCard[] = [
  {
    icon: '/icons/svg1.svg',
    title: 'Precise measurement',
    description: 'Creates unique 3D model of your face for accurate health measurements.',
    hoverImage: '/scan-previews/hover1.webp'
  },
  {
    icon: '/icons/svg2.svg',
    title: 'Detailed facial data',
    description: 'Reveals detailed facial data for more accurate health monitoring.',
    hoverImage: '/scan-previews/hover2.webp'
  }
];

const rightCards: FeatureCard[] = [
  {
    icon: '/icons/svg3.svg',
    title: 'Micro-movement detection',
    description: 'Detects tiny facial movements that go unnoticed by the human eye.',
    hoverImage: '/scan-previews/hover3.webp'
  },
  {
    icon: '/icons/svg4.svg',
    title: 'Tracking the pulse',
    description: 'Tracks the flow and pulses of blood beneath your skin.',
    hoverImage: '/scan-previews/hover4.webp'
  }
];

function FeatureCard({ icon, title, description, hoverImage, onHover }: FeatureCard & { onHover: (image: string | null) => void }) {
  return (
    <div 
      className="flex items-start bg-white/50 backdrop-blur-sm border border-gray-200 rounded-[20px] p-6 
                 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/50 hover:bg-white 
                 transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => onHover(hoverImage)}
      onMouseLeave={() => onHover(null)}
    >
      <img 
        src={icon} 
        alt="" 
        className="w-8 h-8 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition-colors"
      />
      <div className="w-px h-12 bg-gray-200 mx-4 group-hover:bg-blue-500/50 transition-colors"></div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="mt-2 text-gray-600 group-hover:text-gray-800 transition-colors">{description}</p>
      </div>
    </div>
  );
}

export function ComparisonView() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold mb-12 text-gray-900">
          What you see <span className="text-blue-500">vs</span> what camera & AI see
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left cards */}
          <div className="space-y-8">
            {leftCards.map((card, index) => (
              <FeatureCard key={index} {...card} onHover={setCurrentImage} />
            ))}
          </div>

          {/* Center image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4]">
              <Image
                src={currentImage || "/scan-previews/original.webp"}
                alt="Face"
                fill
                className="rounded-[30px] shadow-xl object-cover transition-all duration-300"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 rounded-[30px] bg-gradient-to-t from-gray-100/50 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right cards */}
          <div className="space-y-8">
            {rightCards.map((card, index) => (
              <FeatureCard key={index} {...card} onHover={setCurrentImage} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 