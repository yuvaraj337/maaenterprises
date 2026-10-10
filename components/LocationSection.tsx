'use client';

import React from 'react';
import { MapPin, Phone, MessageSquare, User, Navigation, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';

interface LocationSectionProps {
  onOpenVisitModal: () => void;
}

export default function LocationSection({ onOpenVisitModal }: LocationSectionProps) {
  // Verified location search query for Near SBI Bank, Mahagama
  const mapSearchQuery = encodeURIComponent('SBI Bank, Mahagama, Jharkhand');
  const embedMapUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&hl=en&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  return (
    <section id="contact" className="relative py-24 bg-[#06080C] text-white border-t border-white/5 overflow-hidden">
      {/* Ambient Blue/Green Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00E5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#00E5FF] mb-2">
            LOCATION & CONTACT
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-display tracking-tight leading-none mb-3">
            MAA ENTERPRISES
          </h2>
          <p className="text-sm text-gray-300 font-medium">
            Northstar EV Dealership • Near SBI Bank, Mahagama
          </p>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto mt-4" />
        </div>

        {/* Two-Column Grid: LEFT (Interactive Map) | RIGHT (Dealership Info & CTAs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: Map Visual */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0a1020]/80 border border-[#00E5FF]/30 p-2 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.7)] flex flex-col justify-between min-h-[380px] sm:min-h-[440px]">
            <div className="relative w-full h-full min-h-[340px] rounded-xl overflow-hidden">
              <iframe
                title="MAA Enterprises Mahagama Map"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[340px] rounded-xl"
              />
              {/* Floating Showroom Badge */}
              <div className="absolute top-3 left-3 bg-[#06080C]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                  Showroom In Mahagama
                </span>
              </div>
            </div>

            {/* Bottom Map Bar with Get Directions */}
            <div className="pt-3 px-3 pb-1 flex items-center justify-between text-xs text-gray-400">
              <span>Location Reference: Near SBI Bank, Mahagama</span>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E5FF] font-bold hover:underline flex items-center gap-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* RIGHT: Dealership Information & 4 Prominent Functional Actions */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0a1020]/80 border border-[#00E5FF]/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.7)] text-left">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase font-display tracking-wide mb-1">
                  MAA Enterprises — Northstar EV
                </h3>
                <p className="text-xs text-[#00E5FF] font-semibold">
                  Electric Scooter Sales, Service & Spare Parts
                </p>
              </div>

              {/* Address Reference */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Location Reference
                  </span>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    Near SBI Bank, Mahagama
                  </p>
                </div>
              </div>

              {/* Proprietor */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Proprietor
                  </span>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    J.K. Poddar
                  </p>
                </div>
              </div>

              {/* Phone Line */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Phone Number
                  </span>
                  <a
                    href="tel:9304456205"
                    className="text-sm font-black text-white hover:text-[#00E5FF] transition-colors block"
                  >
                    9304456205
                  </a>
                </div>
              </div>

              {/* Financing Feature */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">Bajaj Finserv EMI Available</span>
                  <span className="text-[11px] text-gray-400">Ask about electric scooter financing at our showroom</span>
                </div>
              </div>
            </div>

            {/* 4 PROMINENT FUNCTIONAL ACTIONS */}
            <div className="pt-6 border-t border-white/10 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Call Now */}
                <a
                  href="tel:9304456205"
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>

                {/* 2. WhatsApp Enquiry */}
                <a
                  href="https://wa.me/919304456205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 3. Get Directions */}
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation className="w-4 h-4 text-[#00E5FF]" />
                  <span>Get Directions</span>
                </a>

                {/* 4. Enquire About a Scooter */}
                <button
                  onClick={onOpenVisitModal}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Enquire Online</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
