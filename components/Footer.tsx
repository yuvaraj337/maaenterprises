'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck, MessageSquare, Zap, Leaf } from 'lucide-react';

interface FooterProps {
  onOpenVisitModal: () => void;
  onExploreBikes?: () => void;
}

export default function Footer({ onOpenVisitModal, onExploreBikes }: FooterProps) {
  return (
    <footer className="relative bg-[#04060A] text-white border-t border-white/10 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-black/60 border border-[#00E5FF]/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-[#00E5FF]">
                  <polygon points="50,15 57,43 85,50 57,57 50,85 43,57 15,50 43,43" fill="#00E5FF" />
                  <path d="M60 25 C75 25 80 40 75 50 C68 46 62 40 60 25 Z" fill="#10B981" />
                </svg>
              </div>
              <span className="text-xl font-black uppercase tracking-tight text-white font-display">
                MAA <span className="text-[#E53935]">ENTERPRISES</span>
              </span>
            </div>

            <p className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider">
              NORTHSTAR EV ELECTRIC SCOOTERS
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm font-normal">
              Official Northstar EV electric scooter dealership in Mahagama. Ride a cleaner tomorrow with zero-emission urban mobility. Offering electric scooter sales, maintenance care, genuine spare parts, and Bajaj Finserv EMI financing.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-400 hover:text-[#00E5FF] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Dealership Staff Login</span>
              </Link>
            </div>
          </div>

          {/* Scooter Colours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              Scooter Colours
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Turquoise Edition (Hero)</a></li>
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Crimson Red</a></li>
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Vibrant Pink</a></li>
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Sky Blue</a></li>
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Electric Purple</a></li>
              <li><a href="#colours" className="hover:text-[#00E5FF] transition-colors">Dark Blue</a></li>
            </ul>
          </div>

          {/* Dealership Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              Services & Financing
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#services" className="hover:text-[#00E5FF] transition-colors">Electric Scooter Sales</a></li>
              <li><a href="#services" className="hover:text-[#00E5FF] transition-colors">Service & Maintenance</a></li>
              <li><a href="#services" className="hover:text-[#00E5FF] transition-colors">Genuine Spare Parts</a></li>
              <li><a href="#services" className="hover:text-[#00E5FF] transition-colors">Bajaj Finserv EMI Enquiries</a></li>
              <li><a href="#benefits" className="hover:text-[#00E5FF] transition-colors">Eco-Friendly Advantages</a></li>
              <li>
                <button onClick={onOpenVisitModal} className="hover:text-[#00E5FF] transition-colors text-left cursor-pointer">
                  Book Showroom Visit
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-display">
              Showroom Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>Near SBI Bank, Mahagama</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Proprietor:</span>
                <span className="text-white font-bold">J.K. Poddar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:9304456205" className="hover:text-[#00E5FF] font-black text-white">9304456205</a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href="https://wa.me/919304456205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] font-bold text-[11px] hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquiry</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Taglines */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} MAA Enterprises — Northstar EV. All Rights Reserved. Near SBI Bank, Mahagama.</p>
          <div className="flex items-center gap-4 text-gray-400 font-semibold">
            <span>Ride a Cleaner Tomorrow</span>
            <span>•</span>
            <span>Electric Mobility, A Brighter Tomorrow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
