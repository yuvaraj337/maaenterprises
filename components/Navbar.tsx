'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Calendar, ChevronRight, Phone, ShieldCheck, MapPin } from 'lucide-react';

interface NavbarProps {
  onOpenVisitModal: () => void;
  onOpenBookingModal?: () => void;
}

export default function Navbar({ onOpenVisitModal, onOpenBookingModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Scooters', href: '#scooters' },
    { name: 'Colours', href: '#colours' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#benefits' },
    { name: 'Contact', href: '#contact' },
  ];

  const mobileScooterColours = [
    { name: 'Turquoise Edition', tag: 'Flagship Hero', image: '/scooters/turquoise.jpg', colorHex: '#00F0FF' },
    { name: 'Crimson Red', tag: 'Sport Edition', image: '/scooters/red.jpg', colorHex: '#DC2626' },
    { name: 'Vibrant Pink', tag: 'City Commuter', image: '/scooters/pink.jpg', colorHex: '#EC4899' },
    { name: 'Sky Blue', tag: 'Modern Classic', image: '/scooters/skyblue.jpg', colorHex: '#38BDF8' },
    { name: 'Electric Purple', tag: 'Trendsetter', image: '/scooters/purple.jpg', colorHex: '#A855F7' },
    { name: 'Dark Blue', tag: 'Executive Navy', image: '/scooters/darkblue.jpg', colorHex: '#1E40AF' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav py-2.5 sm:py-3 bg-black/85 backdrop-blur-md'
            : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* LEFT: MAA Enterprises & Northstar EV Branding */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2.5 group focus:outline-none">
              {/* Eco Star Logo Badge */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 border border-[#00E5FF]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.25)] group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 100 100" className="w-5 h-5 fill-[#00E5FF]">
                  <polygon points="50,15 57,43 85,50 57,57 50,85 43,57 15,50 43,43" fill="#00E5FF" />
                  <path d="M60 25 C75 25 80 40 75 50 C68 46 62 40 60 25 Z" fill="#10B981" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white uppercase leading-none font-display">
                  MAA <span className="text-[#E53935]">ENTERPRISES</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#00E5FF] leading-tight">
                  NORTHSTAR EV
                </span>
              </div>
            </Link>

            {/* Location Tag */}
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/20">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">
                  Near SBI Bank, Mahagama
                </span>
                <span className="text-[9px] font-medium text-gray-400 leading-tight">
                  Proprietor: J.K. Poddar
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-[#00E5FF] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Direct Call Button */}
            <a
              href="tel:9304456205"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white text-[11px] font-bold tracking-wide transition-colors"
            >
              <Phone className="w-3 h-3 text-[#10B981]" />
              <span>9304456205</span>
            </a>

            {/* Enquire / Visit CTA */}
            <button
              onClick={onOpenVisitModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#E53935] to-[#D32F2F] hover:from-[#EF5350] hover:to-[#E53935] text-white text-[11px] sm:text-xs font-black tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(229,57,53,0.4)] transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-3 h-3" />
              <span>Enquire</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-full flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors focus:outline-none lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col pt-20 pb-8 px-6 overflow-y-auto lg:hidden">
          {/* Header in menu */}
          <div className="border-b border-white/10 pb-4 mb-5">
            <h3 className="text-lg font-black text-white uppercase font-display">
              MAA <span className="text-[#E53935]">ENTERPRISES</span>
            </h3>
            <p className="text-xs font-bold text-[#00E5FF] tracking-wider uppercase">
              NORTHSTAR EV DEALERSHIP
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Near SBI Bank, Mahagama • Prop: J.K. Poddar
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3 mb-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-white/90 hover:text-[#00E5FF] py-1 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </a>
            ))}
          </div>

          {/* Scooter Colour Variants Spotlight */}
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] block mb-3">
              Available Scooter Colours
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {mobileScooterColours.map((scooter) => (
                <a
                  key={scooter.name}
                  href="#colours"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2.5 bg-white/5 border border-white/10 flex items-center gap-2.5 hover:border-[#00E5FF]/40 transition-colors"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/30"
                    style={{ backgroundColor: scooter.colorHex }}
                  />
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[11px] font-bold text-white truncate">
                      {scooter.name}
                    </span>
                    <span className="text-[9px] text-gray-400 truncate">
                      {scooter.tag}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href="tel:9304456205"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 9304456205</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVisitModal();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Showroom Visit / EMI Enquiry</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
