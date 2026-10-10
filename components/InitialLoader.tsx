'use client';

import React, { useState, useEffect } from 'react';

interface InitialLoaderProps {
  onLoaded: () => void;
}

export default function InitialLoader({ onLoaded }: InitialLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Electric Mobility Showroom...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Critical Priority Assets to preload before revealing Hero
    const criticalAssets = [
      '/frames/hero-mobile/frame_00001.webp',
      '/scooters/turquoise.jpg',
      '/scooters/red.jpg',
    ];

    let loadedCount = 0;
    const total = criticalAssets.length;

    const updateProgress = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / total) * 100);
      setProgress(pct);

      if (pct < 40) {
        setStatusText('Loading Northstar EV Showroom...');
      } else if (pct < 80) {
        setStatusText('Preparing Electric Scooter Showcase...');
      } else {
        setStatusText('Showroom Ready');
      }

      if (loadedCount >= total) {
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => {
            onLoaded();
          }, 600);
        }, 300);
      }
    };

    criticalAssets.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Fallback safety timeout so user is never stuck
    const safetyTimeout = setTimeout(() => {
      setProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        onLoaded();
      }, 600);
    }, 3500);

    return () => clearTimeout(safetyTimeout);
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#06080C] flex flex-col items-center justify-center transition-opacity duration-600 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Radial Atmosphere with Green Leaf & Electric Cyan Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* MAA Enterprises & Northstar EV Branding */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing Eco Star Crest */}
        <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#00E5FF]/25 rounded-full blur-xl animate-ping"
            style={{ animationDuration: '3s' }}
          />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-[#0a1424] via-[#0d2238] to-[#12363a] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.45)] border border-[#00E5FF]/40">
            {/* Northstar 4-Point Compass Star + Green Leaf Accent */}
            <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#00E5FF] filter drop-shadow-md">
              {/* Central 4-point star */}
              <polygon points="50,15 57,43 85,50 57,57 50,85 43,57 15,50 43,43" fill="#00E5FF" />
              {/* Eco Leaf Accent */}
              <path
                d="M60 25 C75 25 80 40 75 50 C68 46 62 40 60 25 Z"
                fill="#10B981"
              />
            </svg>
          </div>
        </div>

        {/* MAA Enterprises Typography */}
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.25em] text-white font-display mb-1 flex items-center gap-1.5">
          <span>MAA</span>
          <span className="text-[#E53935]">ENTERPRISES</span>
        </h1>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF] mb-1">
          NORTHSTAR EV • MAHAGAMA
        </p>
        <p className="text-[9px] font-semibold tracking-wider text-gray-400 uppercase mb-8">
          Ride a Cleaner Tomorrow
        </p>

        {/* Sleek Progress Bar */}
        <div className="w-56 sm:w-64 h-[3px] bg-white/10 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-[#00E5FF] via-[#10B981] to-[#00E5FF] rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_#00E5FF]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage & Status Text */}
        <div className="flex items-center justify-between w-56 sm:w-64 text-[10px] uppercase font-bold tracking-wider text-gray-400">
          <span>{statusText}</span>
          <span className="text-white font-display">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
