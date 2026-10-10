'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface HeroSectionProps {
  onOpenVisitModal: () => void;
  onExploreBikes: () => void;
}

const TOTAL_FRAMES = 240;
const MOBILE_MAX_CACHE = 50;

export default function HeroSection({ onOpenVisitModal, onExploreBikes }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [framesLoadedCount, setFramesLoadedCount] = useState(0);
  const [isInitialFrameReady, setIsInitialFrameReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Cached frame images
  const framesCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrameIndexRef = useRef<number>(0);
  const latestTargetFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Format frame filename:
  // Mobile: 5-digit zero-padded webp (frame_00001.webp - frame_00240.webp)
  // Desktop: 6-digit zero-padded jpg (frame_000001.jpg - frame_000240.jpg)
  const getFramePath = useCallback((index: number, mobile: boolean) => {
    if (mobile) {
      const frameNum = String(index + 1).padStart(5, '0');
      return `/frames/hero-mobile/frame_${frameNum}.webp`;
    }
    const frameNum = String(index + 1).padStart(6, '0');
    return `/frames/hero-desktop/frame_${frameNum}.jpg`;
  }, []);

  // Detect mobile vs desktop and reduced-motion preferences
  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => {
        if (prev !== mobile) {
          framesCache.current.clear();
          setFramesLoadedCount(0);
          setIsInitialFrameReady(false);
        }
        return mobile;
      });
    };

    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQueryMotion.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQueryMotion.addEventListener('change', motionHandler);

    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
      mediaQueryMotion.removeEventListener('change', motionHandler);
    };
  }, []);

  // Render Frame onto Canvas with faithful cover scaling and centered focal point
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Check exact frame
    let img = framesCache.current.get(frameIndex);

    // Fallback: search nearest loaded frame in cache so canvas never flashes or flickers
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestDistance = Infinity;
      let closestImg: HTMLImageElement | null = null;
      framesCache.current.forEach((cachedImg, idx) => {
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          const dist = Math.abs(idx - frameIndex);
          if (dist < closestDistance) {
            closestDistance = dist;
            closestImg = cachedImg;
          }
        }
      });
      img = closestImg || undefined;
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.width;
    const height = canvas.height;

    // Cover aspect ratio scaling preserving camera focal point & scooter center
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawW = width;
    let drawH = height;
    let drawX = 0;
    let drawY = 0;

    if (canvasAspect > imgAspect) {
      drawW = width;
      drawH = width / imgAspect;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    currentFrameIndexRef.current = frameIndex;
  }, []);

  // Progressive Preloading Engine with mobile memory pruning
  useEffect(() => {
    let isMounted = true;
    const cache = framesCache.current;

    // Helper: fetch frame safely
    const fetchFrame = (idx: number): Promise<HTMLImageElement | null> => {
      if (cache.has(idx)) {
        return Promise.resolve(cache.get(idx)!);
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(idx, isMobile);
        img.onload = () => {
          if (!isMounted) return resolve(null);
          cache.set(idx, img);
          setFramesLoadedCount((c) => c + 1);

          // Prune memory if cache exceeds maximum threshold on mobile devices
          if (isMobile && cache.size > MOBILE_MAX_CACHE) {
            const currentCenter = currentFrameIndexRef.current;
            const toDelete: number[] = [];
            cache.forEach((_, cachedIdx) => {
              if (cachedIdx === 0 || cachedIdx === TOTAL_FRAMES - 1) return;
              if (Math.abs(cachedIdx - currentCenter) > 28) {
                toDelete.push(cachedIdx);
              }
            });
            for (let k = 0; k < toDelete.length; k++) {
              cache.delete(toDelete[k]);
              if (cache.size <= MOBILE_MAX_CACHE - 10) break;
            }
          }

          resolve(img);
        };
        img.onerror = () => resolve(null);
      });
    };

    // 1. Immediately load Frame 0 (exterior) and render immediately
    fetchFrame(0).then((img) => {
      if (!isMounted || !img) return;
      setIsInitialFrameReady(true);
      renderFrame(0);
    });

    // 2. Preload final frame (turquoise scooter anchor)
    fetchFrame(TOTAL_FRAMES - 1);

    // 3. Stride keyframes (every 6th frame) for responsive scrubbing
    const loadKeyframes = async () => {
      for (let i = 6; i < TOTAL_FRAMES - 1; i += 6) {
        if (!isMounted) return;
        await fetchFrame(i);
      }
    };

    // 4. Fill in intermediate frames progressively with slight breathing room
    const loadAllRemainingFrames = async () => {
      for (let i = 1; i < TOTAL_FRAMES - 1; i++) {
        if (!isMounted) return;
        if (!cache.has(i)) {
          fetchFrame(i);
          if (i % 8 === 0) {
            await new Promise((r) => setTimeout(r, 25));
          }
        }
      }
    };

    loadKeyframes().then(() => {
      if (isMounted) loadAllRemainingFrames();
    });

    return () => {
      isMounted = false;
    };
  }, [isMobile, getFramePath, renderFrame]);

  // Handle Resize of Canvas with devicePixelRatio support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      renderFrame(currentFrameIndexRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // Scroll Engine: Map Scroll Progress to Frame Index using requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollDistance = containerRef.current.offsetHeight - window.innerHeight;

      if (totalScrollDistance <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, currentScroll / totalScrollDistance));

      setScrollProgress(rawProgress);

      if (prefersReducedMotion) {
        // If reduced motion requested, stay at final frame or frame 0
        latestTargetFrameRef.current = rawProgress > 0.5 ? TOTAL_FRAMES - 1 : 0;
      } else {
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(rawProgress * (TOTAL_FRAMES - 1)))
        );
        latestTargetFrameRef.current = targetFrame;
      }

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          renderFrame(latestTargetFrameRef.current);
          rafIdRef.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [renderFrame, prefersReducedMotion]);

  // Navigation click handler to smoothly scroll to any hero state on desktop
  const handleScrollToStage = useCallback((targetStage: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalDistance = containerRef.current.offsetHeight - window.innerHeight;
    let targetProgress = 0;
    if (targetStage === 1) targetProgress = 0;
    else if (targetStage === 2) targetProgress = 0.52;
    else if (targetStage === 3) targetProgress = 0.88;

    window.scrollTo({
      top: containerTop + targetProgress * totalDistance,
      behavior: 'smooth',
    });
  }, []);

  // Quick scroll to showroom entrance (mobile)
  const handleMobileEnterShowroom = useCallback(() => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalDistance = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: containerTop + 0.35 * totalDistance,
      behavior: 'smooth',
    });
  }, []);

  // Desktop Transition Opacities
  const state1Opacity =
    scrollProgress < 0.28
      ? 1
      : scrollProgress > 0.36
      ? 0
      : 1 - (scrollProgress - 0.28) / (0.36 - 0.28);

  const state2Opacity =
    scrollProgress < 0.30 || scrollProgress > 0.74
      ? 0
      : scrollProgress < 0.38
      ? (scrollProgress - 0.30) / (0.38 - 0.30)
      : scrollProgress > 0.66
      ? 1 - (scrollProgress - 0.66) / (0.74 - 0.66)
      : 1;

  const state3Opacity =
    scrollProgress < 0.68
      ? 0
      : scrollProgress < 0.76
      ? (scrollProgress - 0.68) / (0.76 - 0.68)
      : 1;

  // Mobile Transition Opacities:
  // Mobile Stage 1 (0.00 - 0.22): Exterior of MAA Enterprises — Northstar EV
  const mobileStage1Opacity =
    scrollProgress < 0.12
      ? 1
      : scrollProgress > 0.22
      ? 0
      : 1 - (scrollProgress - 0.12) / (0.22 - 0.12);

  // Mobile Stage 2 (0.25 - 0.70): Camera gliding into showroom & revealing interior & scooters
  const mobileStage2Opacity =
    scrollProgress < 0.24 || scrollProgress > 0.72
      ? 0
      : scrollProgress < 0.32
      ? (scrollProgress - 0.24) / (0.32 - 0.24)
      : scrollProgress > 0.64
      ? 1 - (scrollProgress - 0.64) / (0.72 - 0.64)
      : 1;

  // Mobile Stage 3 (0.74 - 1.00): Turquoise Northstar EV scooter prominently displayed
  const mobileStage3Opacity =
    scrollProgress < 0.72
      ? 0
      : scrollProgress < 0.82
      ? (scrollProgress - 0.72) / (0.82 - 0.72)
      : 1;

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-black select-none ${
        isMobile ? 'h-[290vh]' : 'h-[380vh]'
      }`}
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden">
        {/* Canvas Frame Renderer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Ambient Top Vignette for Navbar Integration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

        {/* Ambient Bottom Vignette for Grounding */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />

        {/* ========================================================================= */}
        {/* MOBILE EXPERIENCE: MAA ENTERPRISES — NORTHSTAR EV CINEMATIC ENTRANCE      */}
        {/* ========================================================================= */}
        {isMobile ? (
          <>
            {/* MOBILE STAGE 1: EXTERIOR — "MAA ENTERPRISES — NORTHSTAR EV" */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: mobileStage1Opacity,
                display: mobileStage1Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              {/* Top/Center Brand Header */}
              <div
                className="absolute left-1/2 top-[16%] -translate-x-1/2 text-center w-full max-w-sm px-5"
                style={{
                  transform: `translate(-50%, ${(1 - mobileStage1Opacity) * -20}px)`,
                }}
              >
                {/* Electric Cyan Eyebrow Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#00E5FF]">
                    MAA ENTERPRISES
                  </span>
                </div>

                {/* Main Slanted Title */}
                <h1 className="font-hero-headline text-4xl sm:text-5xl tracking-tight leading-[0.95] mb-2.5">
                  <span className="hero-text-metallic-white">NORTHSTAR </span>
                  <span className="hero-text-turquoise hero-text-glow-turquoise">EV</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs font-normal text-white/80 max-w-xs mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Step into the future of urban electric mobility. Pure performance, zero compromises.
                </p>

                {/* Glowing Accent Line */}
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto mt-3 shadow-[0_0_8px_#00E5FF]" />
              </div>

              {/* Bottom Interactive Scroll Prompt */}
              <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                <button
                  onClick={handleMobileEnterShowroom}
                  className="w-12 h-12 rounded-full border border-[#00E5FF]/40 hover:border-[#00E5FF] bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-[#00E5FF] transition-all transform active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
                  aria-label="Scroll to enter showroom"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-none stroke-current stroke-2 animate-bounce"
                  >
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </button>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/85 mt-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  SCROLL TO ENTER SHOWROOM
                </span>
              </div>
            </div>

            {/* MOBILE STAGE 2: INSIDE SHOWROOM — CINEMATIC UNOBSTRUCTED WALKTHROUGH */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: mobileStage2Opacity,
                display: mobileStage2Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              {/* Sleek Floating Pill at Bottom Right to Keep Camera Focus Crystal Clear */}
              <div className="absolute right-4 bottom-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/15 backdrop-blur-md shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                  INSIDE SHOWROOM
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] ml-1">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
            </div>

            {/* MOBILE STAGE 3: FINAL SHOWCASE — TURQUOISE NORTHSTAR EV SCOOTER */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: mobileStage3Opacity,
                display: mobileStage3Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              {/* Upper Screen Title Block (Leaving Turquoise Scooter in Center Free) */}
              <div
                className="absolute left-1/2 top-[12%] -translate-x-1/2 text-center w-full max-w-sm px-5"
                style={{
                  transform: `translate(-50%, ${(1 - mobileStage3Opacity) * 15}px)`,
                }}
              >
                {/* Flagship Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#00E5FF]">
                    NORTHSTAR EV • FLAGSHIP
                  </span>
                </div>

                {/* Bold Turquoise Headline */}
                <h2 className="font-hero-headline text-3xl sm:text-4xl tracking-tight leading-tight mb-1.5">
                  <span className="block hero-text-metallic-white">THE TURQUOISE</span>
                  <span className="block hero-text-turquoise hero-text-glow-turquoise">
                    EDITION
                  </span>
                </h2>

                <p className="text-[11px] font-normal text-white/80 max-w-xs mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Instant electric torque. Intelligent regenerative braking. Pure road presence.
                </p>
              </div>

              {/* Bottom Touch Actions & Next Section Transition Hint */}
              <div className="absolute inset-x-4 bottom-6 flex flex-col items-center gap-2.5 pointer-events-auto">
                <div className="flex items-center justify-center gap-2.5 w-full max-w-xs">
                  <button
                    onClick={onExploreBikes}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Explore Fleet</span>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current stroke-2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    onClick={onOpenVisitModal}
                    className="flex-1 py-3 px-4 rounded-xl bg-black/60 hover:bg-black/80 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center backdrop-blur-md active:scale-95 transition-all cursor-pointer shadow-md"
                  >
                    <span>Book Visit</span>
                  </button>
                </div>

                {/* Hint to continue scrolling down naturally into next section */}
                <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-white/60">
                  <span>Scroll to explore models</span>
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current stroke-2 animate-bounce">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* DESKTOP EXPERIENCE: PRESERVED 100% UNCHANGED                              */
          /* ========================================================================= */
          <>
            {/* STATE 1: EXTERIOR VIEW — "READY TO RIDE?" */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: state1Opacity,
                display: state1Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[20%] sm:top-[22%] md:top-[24%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - state1Opacity) * -15}px)` }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80 mb-2 sm:mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  WELCOME TO HIRA AUTO AGENCY
                </p>

                <h1 className="font-hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-[-0.015em] leading-[0.95] mb-3 sm:mb-4">
                  <span className="hero-text-metallic-white">READY TO </span>
                  <span className="hero-text-electric-blue hero-text-glow-blue">RIDE?</span>
                </h1>

                <p className="text-xs sm:text-sm md:text-base font-normal text-white/75 max-w-lg mx-auto leading-relaxed mb-4 sm:mb-5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Discover Yamaha&apos;s world of performance, innovation<br className="hidden sm:block" />
                  {' '}and limitless adventure.
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#00A3FF]" />
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400 drop-shadow-[0_0_8px_rgba(0,163,255,0.7)]">
                    RIDE THE NEXT LEVEL
                  </span>
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#00A3FF]" />
                </div>
              </div>

              <div className="absolute left-1/2 bottom-8 sm:bottom-10 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                <button
                  onClick={() => handleScrollToStage(2)}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/40 hover:border-white bg-black/25 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.6)] cursor-pointer"
                  aria-label="Scroll to explore showroom"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 animate-bounce">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </button>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/70 mt-2.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  SCROLL TO EXPLORE
                </span>
              </div>
            </div>

            {/* STATE 2: INSIDE SHOWROOM — "FEEL THE RIDE" */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: state2Opacity,
                display: state2Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[64%] sm:top-[66%] md:top-[68%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - state2Opacity) * 15}px)` }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  WELCOME TO HIRA AUTO AGENCY
                </p>

                <h2 className="font-hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-[-0.015em] leading-[0.95] mb-3">
                  <span className="hero-text-metallic-white">FEEL THE </span>
                  <span className="relative inline-block">
                    <span className="hero-text-electric-blue hero-text-glow-blue relative z-10">RIDE</span>
                    <span className="absolute -inset-y-1 left-2 sm:left-4 -right-8 sm:-right-14 bg-gradient-to-r from-[#00A3FF]/75 via-[#0080FF]/40 to-transparent blur-md pointer-events-none" />
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-normal text-white/80 max-w-xl mx-auto leading-relaxed mb-3 sm:mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Experience Yamaha up close. Explore. Touch. Imagine your next ride.
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#00A3FF]" />
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-sky-400 drop-shadow-[0_0_8px_rgba(0,163,255,0.7)]">
                    RIDE THE NEXT LEVEL
                  </span>
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#00A3FF]" />
                </div>
              </div>

              <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 bottom-6 sm:bottom-8 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">03</span>
                  <span className="h-4 w-[1.5px] bg-white/40" />
                  <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">Inside Showroom</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                  <span className="w-9 sm:w-14 h-1.5 rounded-full bg-[#0099FF] shadow-[0_0_12px_#0099FF]" />
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handleScrollToStage(1)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Previous scene"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleScrollToStage(3)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Next scene"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* STATE 3: RECEPTION — "YOUR RIDE STARTS HERE" */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: state3Opacity,
                display: state3Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[64%] sm:top-[66%] md:top-[68%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - state3Opacity) * 15}px)` }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  WELCOME TO HIRA AUTO AGENCY
                </p>

                <h2 className="font-hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-[-0.015em] leading-[0.92] mb-3 sm:mb-4">
                  <span className="block hero-text-metallic-white">YOUR RIDE</span>
                  <span className="block">
                    <span className="hero-text-metallic-white">STARTS </span>
                    <span className="hero-text-electric-blue hero-text-glow-blue">HERE</span>
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-normal text-white/80 max-w-xl mx-auto leading-relaxed mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Explore. Experience. Belong to the Yamaha Family.
                </p>

                <div className="w-16 sm:w-20 h-[2px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent mx-auto mt-2" />
              </div>

              <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 bottom-6 sm:bottom-8 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">04</span>
                  <span className="h-4 w-[1.5px] bg-white/40" />
                  <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">At Reception (Final)</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                  <span className="w-6 sm:w-10 h-1 rounded-full bg-white/25" />
                  <span className="w-9 sm:w-14 h-1.5 rounded-full bg-[#0099FF] shadow-[0_0_12px_#0099FF]" />
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handleScrollToStage(2)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Previous scene"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={onExploreBikes}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Explore bikes catalog"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
