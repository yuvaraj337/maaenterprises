'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, Calendar, ArrowRight, ShieldCheck, MapPin, Zap, Phone } from 'lucide-react';

export interface Variant {
  id: string;
  bike_id: string;
  name: string;
  ex_showroom_price: number;
  color_name: string;
  color_hex: string;
  image_url: string;
  in_stock: number;
}

export interface Bike {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  engine_cc: string;
  max_power: string;
  max_torque: string;
  fuel_capacity: string;
  mileage: string;
  curb_weight: string;
  image_url: string;
  variants: Variant[];
}

interface BikeConfiguratorModalProps {
  bike: Bike | null;
  isOpen: boolean;
  onClose: () => void;
  onBookBike: (bikeId: string, variantId: string) => void;
  onBookVisit: (bikeId: string, variantId: string) => void;
}

const SCOOTER_COLOUR_MAP: Record<string, string> = {
  Turquoise: '/scooters/turquoise.jpg',
  Red: '/scooters/red.jpg',
  Pink: '/scooters/pink.jpg',
  'Sky Blue': '/scooters/skyblue.jpg',
  Purple: '/scooters/purple.jpg',
  'Dark Blue': '/scooters/darkblue.jpg',
};

export default function BikeConfiguratorModal({
  bike,
  isOpen,
  onClose,
  onBookBike,
  onBookVisit,
}: BikeConfiguratorModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (bike && bike.variants && bike.variants.length > 0) {
      setSelectedVariant(bike.variants[0]);
    }
  }, [bike]);

  if (!isOpen || !bike) return null;

  const currentImg =
    (selectedVariant?.color_name && SCOOTER_COLOUR_MAP[selectedVariant.color_name]) ||
    selectedVariant?.image_url ||
    bike.image_url ||
    '/scooters/turquoise.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0a1020] border border-white/15 p-6 sm:p-8 shadow-2xl my-auto text-left">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/50 border border-white/10 p-3 shadow-inner">
              <Image
                src={currentImg}
                alt={selectedVariant?.name || bike.name}
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            {/* Colour Selector */}
            {bike.variants && bike.variants.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                  Colours:
                </span>
                {bike.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`relative w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      selectedVariant?.id === v.id
                        ? 'scale-125 border-white shadow-[0_0_10px_white]'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: v.color_hex }}
                    title={v.color_name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/40 text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Zap className="w-3.5 h-3.5 text-[#10B981]" />
                MAA Enterprises • Northstar EV
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-display leading-tight mb-2">
                {selectedVariant?.name || bike.name}
              </h2>

              <p className="text-xs text-[#00E5FF] font-semibold mb-3">
                {bike.tagline || 'Ride a Cleaner Tomorrow'}
              </p>

              <p className="text-xs text-gray-300 leading-relaxed mb-6 font-normal">
                {bike.description}
              </p>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-6 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#10B981] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Bajaj Finserv EMI Available
                </span>
                <p className="text-[11px] text-gray-400">
                  Enquire at our showroom Near SBI Bank, Mahagama for financing documentation.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => {
                  onBookVisit(bike.id, selectedVariant?.id || '');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Enquire Now</span>
              </button>
              <a
                href="tel:9304456205"
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#10B981]" />
                <span>Call Dealership</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
