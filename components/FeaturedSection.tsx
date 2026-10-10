'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Phone, Calendar, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { Bike } from './BikeConfiguratorModal';

export interface FeaturedSectionProps {
  bikes?: Bike[];
  onSelectBike: (bikeOrSlug: Bike | string) => void;
  onOpenBookingModal: (bikeId: string, variantId?: string) => void;
  onOpenVisitModal: () => void;
}

export interface ScooterColourOption {
  id: string;
  name: string;
  colorName: string;
  colorHex: string;
  tagline: string;
  description: string;
  image: string;
  isFlagship?: boolean;
}

export const NORTHSTAR_COLOUR_OPTIONS: ScooterColourOption[] = [
  {
    id: 'scooter_turquoise',
    name: 'Northstar EV — Turquoise Edition',
    colorName: 'Turquoise',
    colorHex: '#00F0FF',
    tagline: 'Flagship Showroom Hero',
    description: 'The signature turquoise finish seen prominently in the MAA Enterprises showroom. Bold, futuristic, and unmistakable on city roads.',
    image: '/scooters/turquoise.jpg',
    isFlagship: true,
  },
  {
    id: 'scooter_red',
    name: 'Northstar EV — Red Edition',
    colorName: 'Red',
    colorHex: '#DC2626',
    tagline: 'Dynamic & Sporty',
    description: 'Vibrant crimson red finish designed to turn heads. Sharp fairing lines paired with aggressive dual LED illumination.',
    image: '/scooters/red.jpg',
  },
  {
    id: 'scooter_pink',
    name: 'Northstar EV — Pink Edition',
    colorName: 'Pink',
    colorHex: '#EC4899',
    tagline: 'Vibrant City Commuter',
    description: 'Expressive and stylish modern pink finish. Perfect for sleek daily commuting with zero tailpipe emissions and effortless handling.',
    image: '/scooters/pink.jpg',
  },
  {
    id: 'scooter_skyblue',
    name: 'Northstar EV — Sky Blue Edition',
    colorName: 'Sky Blue',
    colorHex: '#38BDF8',
    tagline: 'Fresh Modern Aesthetic',
    description: 'Bright sky blue gloss bodywork inspiring clean skies and peaceful zero-emission urban travel.',
    image: '/scooters/skyblue.jpg',
  },
  {
    id: 'scooter_purple',
    name: 'Northstar EV — Purple Edition',
    colorName: 'Purple',
    colorHex: '#A855F7',
    tagline: 'Distinctive Electric Spirit',
    description: 'Deep electric purple coat creating a unique, premium presence. Low maintenance and quiet electric reliability.',
    image: '/scooters/purple.jpg',
  },
  {
    id: 'scooter_darkblue',
    name: 'Northstar EV — Dark Blue Edition',
    colorName: 'Dark Blue',
    colorHex: '#1E40AF',
    tagline: 'Executive Deep Navy',
    description: 'Refined dark navy blue finish offering sophisticated road appeal. Dependable electric performance for every daily journey.',
    image: '/scooters/darkblue.jpg',
  },
];

export default function FeaturedSection({
  onSelectBike,
  onOpenBookingModal,
  onOpenVisitModal,
}: FeaturedSectionProps) {
  const [selectedColourId, setSelectedColourId] = useState<string>('scooter_turquoise');
  const [activeTab, setActiveTab] = useState<'ALL' | 'FLAGSHIP' | 'COLOURS'>('ALL');

  const selectedScooter = useMemo(() => {
    return (
      NORTHSTAR_COLOUR_OPTIONS.find((s) => s.id === selectedColourId) ||
      NORTHSTAR_COLOUR_OPTIONS[0]
    );
  }, [selectedColourId]);

  const filteredScooters = useMemo(() => {
    if (activeTab === 'FLAGSHIP') {
      return NORTHSTAR_COLOUR_OPTIONS.filter((s) => s.isFlagship);
    }
    if (activeTab === 'COLOURS') {
      return NORTHSTAR_COLOUR_OPTIONS.filter((s) => !s.isFlagship);
    }
    return NORTHSTAR_COLOUR_OPTIONS;
  }, [activeTab]);

  return (
    <section id="scooters" className="relative py-24 bg-[#07090E] text-white border-t border-white/5 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#E53935]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 backdrop-blur-md mb-3 text-[#00E5FF] text-xs font-bold uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-[#10B981]" />
            Official Northstar EV Lineup
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-display tracking-tight leading-tight">
            ELECTRIC SCOOTER <br />
            <span className="hero-text-turquoise hero-text-glow-turquoise">COLOUR CATALOGUE</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-xl mx-auto">
            Discover Northstar EV electric scooters available at MAA Enterprises. Explore the advertised colour variants and enquire about test rides, sales, and Bajaj Finserv EMI financing.
          </p>

          {/* Quick Filter Buttons */}
          <div className="flex items-center justify-center gap-2.5 mt-8">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              All Colours (6)
            </button>
            <button
              onClick={() => setActiveTab('FLAGSHIP')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'FLAGSHIP'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Turquoise Flagship
            </button>
            <button
              onClick={() => setActiveTab('COLOURS')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'COLOURS'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              5 Advertised Colours
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE SPOTLIGHT SHOWCASE                                            */}
        {/* ========================================================================= */}
        <div id="colours" className="mb-20 rounded-3xl bg-gradient-to-b from-[#0e1320] to-[#080b12] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow matching active color */}
          <div
            className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-30 transition-all duration-700"
            style={{ backgroundColor: selectedScooter.colorHex }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] max-w-xl rounded-2xl overflow-hidden bg-black/40 border border-white/10 p-3 shadow-inner group">
                <Image
                  src={selectedScooter.image}
                  alt={selectedScooter.name}
                  fill
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                {selectedScooter.isFlagship && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF] text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md">
                    Featured Hero
                  </div>
                )}
              </div>

              {/* Interactive Colour Dots Picker */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-2">
                  Select Colour:
                </span>
                {NORTHSTAR_COLOUR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedColourId(opt.id)}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColourId === opt.id
                        ? 'scale-125 border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: opt.colorHex }}
                    title={opt.name}
                    aria-label={`Select ${opt.colorName}`}
                  />
                ))}
              </div>
            </div>

            {/* Information Column */}
            <div className="lg:col-span-5 text-left flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-bold uppercase tracking-wider text-[#00E5FF] mb-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedScooter.colorHex }} />
                  {selectedScooter.colorName} Edition
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-display tracking-tight leading-tight mb-2">
                  {selectedScooter.name}
                </h3>

                <p className="text-sm font-semibold text-[#10B981] mb-4">
                  {selectedScooter.tagline}
                </p>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                  {selectedScooter.description}
                </p>

                {/* Verified Promotional Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Category</span>
                    <span className="text-xs font-bold text-white">Electric Scooter</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Financing</span>
                    <span className="text-xs font-bold text-[#00E5FF]">Bajaj Finserv EMI</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Dealership</span>
                    <span className="text-xs font-bold text-white">MAA Enterprises</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-0.5">Location</span>
                    <span className="text-xs font-bold text-white">Mahagama, SBI Bank</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={onOpenVisitModal}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(229,57,53,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Enquire About {selectedScooter.colorName}</span>
                </button>
                <a
                  href="tel:9304456205"
                  className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#10B981]" />
                  <span>Call 9304456205</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6-COLOUR PRODUCT GRID                                                     */}
        {/* ========================================================================= */}
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display tracking-wide">
              Complete Scooter Colour Range
            </h3>
            <span className="text-xs font-semibold text-gray-400">
              Showing {filteredScooters.length} Colour Variants
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredScooters.map((scooter) => (
              <div
                key={scooter.id}
                className="group rounded-2xl bg-gradient-to-b from-[#0d121c] to-[#07090e] border border-white/10 hover:border-[#00E5FF]/40 transition-all p-5 flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-4 group-hover:scale-[1.02] transition-transform">
                    <Image
                      src={scooter.image}
                      alt={scooter.name}
                      fill
                      className="object-contain p-2"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: scooter.colorHex }} />
                      <span className="text-[10px] font-bold uppercase text-white">
                        {scooter.colorName}
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E5FF] block mb-1">
                      {scooter.tagline}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white uppercase font-display mb-2">
                      {scooter.name}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                      {scooter.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bajaj Finserv EMI</span>
                  </span>

                  <button
                    onClick={() => {
                      setSelectedColourId(scooter.id);
                      onOpenVisitModal();
                    }}
                    className="py-2 px-3.5 rounded-lg bg-white/5 hover:bg-[#E53935] border border-white/15 hover:border-transparent text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Enquire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financing Callout Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-black via-[#0d1526] to-black border border-[#00E5FF]/30 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00E5FF]">
              FINANCING PARTNER
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white uppercase font-display">
              Bajaj Finserv EMI Available
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Ask about easy EMI financing options for Northstar EV electric scooters at MAA Enterprises, Mahagama.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:9304456205"
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Call: 9304456205</span>
            </a>
            <button
              onClick={onOpenVisitModal}
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              Enquire EMI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
