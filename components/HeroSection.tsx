'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Phone, Calendar, ArrowRight, ChevronDown } from 'lucide-react';

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

  // Use the authentic MAA Enterprises — Northstar EV 240-frame sequence for both mobile & desktop
  const getFramePath = useCallback((index: number) => {
    const frameNum = String(index + 1).padStart(5, '0');
    return `/frames/hero-mobile/frame_${frameNum}.webp`;
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

    const fetchFrame = (idx: number): Promise<HTMLImageElement | null> => {
      if (cache.has(idx)) {
        return Promise.resolve(cache.get(idx)!);
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFramePath(idx);
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

    // 4. Fill in intermediate frames progressively
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

  const handleMobileEnterShowroom = useCallback(() => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const totalDistance = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: containerTop + 0.35 * totalDistance,
      behavior: 'smooth',
    });
  }, []);

  // Transitions: Stage 1 (Exterior), Stage 2 (Inside), Stage 3 (Final Turquoise)
  const stage1Opacity =
    scrollProgress < 0.16
      ? 1
      : scrollProgress > 0.28
        ? 0
        : 1 - (scrollProgress - 0.16) / (0.28 - 0.16);

  const stage2Opacity =
    scrollProgress < 0.26 || scrollProgress > 0.72
      ? 0
      : scrollProgress < 0.36
        ? (scrollProgress - 0.26) / (0.36 - 0.26)
        : scrollProgress > 0.64
          ? 1 - (scrollProgress - 0.64) / (0.72 - 0.64)
          : 1;

  const stage3Opacity =
    scrollProgress < 0.72
      ? 0
      : scrollProgress < 0.82
        ? (scrollProgress - 0.72) / (0.82 - 0.72)
        : 1;

  return (
    <section
      ref={containerRef}
      className={`relative w-full bg-black select-none ${isMobile ? 'h-[290vh]' : 'h-[360vh]'
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
        {/* MOBILE HERO VIEW (RESPONSIVE BREAKPOINT < 768px)                           */}
        {/* ========================================================================= */}
        {isMobile ? (
          <>
            {/* MOBILE STAGE 1: EXTERIOR */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage1Opacity,
                display: stage1Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[16%] -translate-x-1/2 text-center w-full max-w-sm px-5"
                style={{
                  transform: `translate(-50%, ${(1 - stage1Opacity) * -20}px)`,
                }}
              >






                {/* Accent Line */}
                <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto mt-3 shadow-[0_0_8px_#00E5FF]" />
              </div>

              {/* Bottom Actions: Explore Scooters & Call Now */}
              <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onExploreBikes}
                    className="py-2.5 px-4 rounded-full bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(229,57,53,0.4)] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Explore Scooters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="tel:9304456205"
                    className="py-2.5 px-4 rounded-full bg-black/60 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Call Now</span>
                  </a>
                </div>

                <button
                  onClick={handleMobileEnterShowroom}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white/80 hover:text-[#00E5FF] transition-colors mt-1"
                >
                  <span>Scroll to enter showroom</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF] animate-bounce" />
                </button>
              </div>
            </div>

            {/* MOBILE STAGE 2: INSIDE SHOWROOM (CINEMATIC UNOBSTRUCTED WALKTHROUGH) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage2Opacity,
                display: stage2Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div className="absolute right-4 bottom-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                  INSIDE SHOWROOM
                </span>
                <span className="text-[9px] font-mono text-[#00E5FF] ml-1">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
            </div>

            {/* MOBILE STAGE 3: TURQUOISE NORTHSTAR EV SCOOTER */}
            <div
              className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage3Opacity,
                display: stage3Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[12%] -translate-x-1/2 text-center w-full max-w-sm px-5"
                style={{
                  transform: `translate(-50%, ${(1 - stage3Opacity) * 15}px)`,
                }}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-[#00E5FF]/40 backdrop-blur-md mb-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-[#00E5FF]">
                    NORTHSTAR EV • FLAGSHIP
                  </span>
                </div>

                <h2 className="font-hero-headline text-3xl sm:text-4xl tracking-tight leading-tight mb-1">
                  <span className="block hero-text-metallic-white">THE TURQUOISE</span>
                  <span className="block hero-text-turquoise hero-text-glow-turquoise">
                    EDITION
                  </span>
                </h2>

                <p className="text-[11px] font-normal text-white/80 max-w-xs mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Instant electric torque. Pure zero-emission performance. Bajaj Finserv EMI available.
                </p>
              </div>

              <div className="absolute inset-x-4 bottom-6 flex flex-col items-center gap-2.5 pointer-events-auto">
                <div className="flex items-center justify-center gap-2.5 w-full max-w-xs">
                  <button
                    onClick={onExploreBikes}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Explore Colours</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="tel:9304456205"
                    className="flex-1 py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-95 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Call Now</span>
                  </a>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-[0.2em] text-white/60">
                  <span>Scroll down to explore fleet</span>
                  <ChevronDown className="w-3 h-3 text-[#00E5FF] animate-bounce" />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* DESKTOP HERO VIEW (REBRANDED FOR MAA ENTERPRISES — NORTHSTAR EV)          */
          /* ========================================================================= */
          <>
            {/* DESKTOP STATE 1: EXTERIOR */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage1Opacity,
                display: stage1Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[20%] sm:top-[22%] md:top-[24%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - stage1Opacity) * -15}px)` }}
              >






                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#00E5FF]" />
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                    RIDE A CLEANER TOMORROW • BAJAJ FINSERV EMI AVAILABLE
                  </span>
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#00E5FF]" />
                </div>
              </div>

              <div className="absolute left-1/2 bottom-8 sm:bottom-10 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                <button
                  onClick={() => handleScrollToStage(2)}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-white/40 hover:border-[#00E5FF] bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.6)] cursor-pointer"
                  aria-label="Scroll to explore showroom"
                >
                  <ChevronDown className="w-5 h-5 animate-bounce text-[#00E5FF]" />
                </button>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/70 mt-2.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  SCROLL TO EXPLORE SHOWROOM
                </span>
              </div>
            </div>

            {/* DESKTOP STATE 2: INSIDE SHOWROOM */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage2Opacity,
                display: stage2Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[62%] sm:top-[64%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - stage2Opacity) * 15}px)` }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  MAA ENTERPRISES — NORTHSTAR EV
                </p>

                <h2 className="font-hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-[-0.015em] leading-[0.95] mb-3">
                  <span className="hero-text-metallic-white">ELECTRIC </span>
                  <span className="hero-text-turquoise hero-text-glow-turquoise">MOBILITY</span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-normal text-white/80 max-w-xl mx-auto leading-relaxed mb-3 sm:mb-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  A Brighter Tomorrow. Experience Northstar EV up close. Explore vibrant colours and quiet efficiency.
                </p>

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent to-[#00E5FF]" />
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    MAKE EVERY RIDE A BETTER CHOICE
                  </span>
                  <span className="w-12 sm:w-20 h-[1.5px] bg-gradient-to-l from-transparent to-[#00E5FF]" />
                </div>
              </div>

              <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 bottom-6 sm:bottom-8 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">02</span>
                  <span className="h-4 w-[1.5px] bg-white/40" />
                  <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">Inside Showroom</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <button
                    onClick={() => handleScrollToStage(1)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Previous scene"
                  >
                    <ChevronDown className="w-5 h-5 rotate-180" />
                  </button>
                  <button
                    onClick={() => handleScrollToStage(3)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 hover:border-white bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Next scene"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* DESKTOP STATE 3: FLAGSHIP SHOWCASE */}
            <div
              className="absolute inset-0 z-20 pointer-events-none select-none transition-opacity duration-300 ease-out"
              style={{
                opacity: stage3Opacity,
                display: stage3Opacity <= 0.005 ? 'none' : 'block',
              }}
            >
              <div
                className="absolute left-1/2 top-[62%] sm:top-[64%] -translate-x-1/2 text-center w-full max-w-4xl px-4"
                style={{ transform: `translate(-50%, ${(1 - stage3Opacity) * 15}px)` }}
              >
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-white/80 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  FLAGSHIP SHOWCASE • PROPRIETOR: J.K. PODDAR
                </p>

                <h2 className="font-hero-headline text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-[-0.015em] leading-[0.92] mb-3 sm:mb-4">
                  <span className="block hero-text-metallic-white">THE TURQUOISE</span>
                  <span className="block hero-text-turquoise hero-text-glow-turquoise">
                    EDITION
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-normal text-white/80 max-w-xl mx-auto leading-relaxed mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Visit us Near SBI Bank, Mahagama. Electric scooter sales, service & genuine parts.
                </p>

                <div className="w-16 sm:w-20 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto mt-2" />
              </div>

              <div className="absolute inset-x-4 sm:inset-x-8 md:inset-x-12 bottom-6 sm:bottom-8 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 sm:gap-2.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span className="text-lg sm:text-2xl font-black text-white leading-none">03</span>
                  <span className="h-4 w-[1.5px] bg-white/40" />
                  <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide">The Turquoise Edition</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <a
                    href="tel:9304456205"
                    className="px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md hover:border-[#10B981] transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Call 9304456205</span>
                  </a>
                  <button
                    onClick={onExploreBikes}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Explore Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
