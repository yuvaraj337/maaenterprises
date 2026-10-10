'use client';

import React from 'react';
import { Leaf, DollarSign, Wrench, ShieldCheck, ArrowRight, Phone } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenVisitModal: () => void;
}

const BENEFITS = [
  {
    icon: Leaf,
    title: 'Eco-Friendly Mobility',
    description:
      'Zero tailpipe emissions and quiet operation. Help create cleaner air and quieter neighbourhoods with every electric ride.',
    color: '#10B981',
    badge: 'Zero Emissions',
  },
  {
    icon: DollarSign,
    title: 'Cost-Saving Potential',
    description:
      'Experience economical daily travel compared to traditional fuel costs. Smart electric commuting keeps everyday running expenses low.',
    color: '#00E5FF',
    badge: 'Smart Savings',
  },
  {
    icon: Wrench,
    title: 'Low Maintenance',
    description:
      'With fewer moving parts than internal combustion engines, enjoy simplified upkeep, less wear-and-tear, and lower service hassle.',
    color: '#F59E0B',
    badge: 'Simplified Care',
  },
  {
    icon: ShieldCheck,
    title: 'Dependable Performance',
    description:
      'Smooth, responsive electric acceleration, agile city handling, and dependable daily reliability for students, professionals, and families.',
    color: '#E53935',
    badge: 'Everyday Reliability',
  },
];

export default function WhyChooseUs({ onOpenVisitModal }: WhyChooseUsProps) {
  return (
    <section id="benefits" className="relative py-24 bg-[#05070B] text-white border-t border-white/5 overflow-hidden">
      {/* Ambient Eco Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#10B981]/30 backdrop-blur-md mb-3 text-[#10B981] text-xs font-bold uppercase tracking-widest">
            <Leaf className="w-3.5 h-3.5" />
            Northstar EV Advantages
          </div>

          {/* Requested Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-display tracking-tight leading-tight">
            MAKE EVERY RIDE <br />
            <span className="hero-text-turquoise hero-text-glow-turquoise">A BETTER CHOICE</span>
          </h2>

          {/* Requested Supporting Text */}
          <p className="mt-4 text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-xl mx-auto">
            Discover a smarter way to move with Northstar EV electric scooters.
          </p>
        </div>

        {/* 4 Core Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl bg-gradient-to-b from-[#0c121e] to-[#07090e] border border-white/10 hover:border-white/25 p-6 flex flex-col justify-between shadow-xl transition-all hover:scale-[1.02] text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${b.color}15`,
                        borderColor: `${b.color}40`,
                        color: b.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${b.color}10`,
                        borderColor: `${b.color}30`,
                        color: b.color,
                      }}
                    >
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase font-display mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                    <span>Electric Mobility</span>
                    <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action strip */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenVisitModal}
            className="py-3 px-6 rounded-full bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(229,57,53,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Book Showroom Visit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="tel:9304456205"
            className="py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4 text-[#10B981]" />
            <span>Call Dealership: 9304456205</span>
          </a>
        </div>
      </div>
    </section>
  );
}
