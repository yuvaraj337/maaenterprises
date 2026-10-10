'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, ArrowRight, Loader2, Calendar, Clock, AlertCircle, Zap } from 'lucide-react';
import { Bike, Variant } from './BikeConfiguratorModal';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikes: Bike[];
  preselectedBikeId?: string;
  preselectedVariantId?: string;
  onBookingComplete?: (booking: any) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  bikes,
  preselectedBikeId,
  preselectedVariantId,
  onBookingComplete
}: BookingModalProps) {
  const [selectedBikeId, setSelectedBikeId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [paymentOption, setPaymentOption] = useState<'ADVANCE' | 'FULL'>('ADVANCE');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);

  // Initialize selected bike and variant
  useEffect(() => {
    if (preselectedBikeId) {
      setSelectedBikeId(preselectedBikeId);
    } else if (bikes.length > 0 && !selectedBikeId) {
      setSelectedBikeId(bikes[0].id);
    }
  }, [preselectedBikeId, bikes, selectedBikeId]);

  useEffect(() => {
    const currentBike = bikes.find((b) => b.id === selectedBikeId);
    if (currentBike && currentBike.variants && currentBike.variants.length > 0) {
      if (preselectedVariantId && currentBike.variants.some((v) => v.id === preselectedVariantId)) {
        setSelectedVariantId(preselectedVariantId);
      } else {
        setSelectedVariantId(currentBike.variants[0].id);
      }
    }
  }, [selectedBikeId, preselectedVariantId, bikes]);

  if (!isOpen) return null;

  const currentBike = bikes.find((b) => b.id === selectedBikeId) || bikes[0];
  const currentVariant = currentBike?.variants?.find((v) => v.id === selectedVariantId) || currentBike?.variants?.[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          bikeId: selectedBikeId || currentBike?.id,
          variantId: selectedVariantId || currentVariant?.id,
          paymentType: paymentOption,
          preferredDate,
          preferredTime,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit enquiry/booking');
      }

      setSuccessBooking(data.booking);
      if (onBookingComplete) onBookingComplete(data.booking);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessBooking(null);
    setName('');
    setPhone('');
    setEmail('');
    setPreferredDate('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0a1020] border border-white/15 p-6 sm:p-8 shadow-2xl my-auto text-left">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successBooking ? (
          /* SUCCESS VIEW */
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold uppercase tracking-wider">
              Enquiry Registered
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display mt-2">
              CONGRATULATIONS!
            </h3>
            <p className="text-sm text-gray-300 max-w-md mx-auto mt-1">
              Your official Northstar EV booking enquiry has been registered with MAA Enterprises, Mahagama.
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-6 p-5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-2.5 max-w-md mx-auto text-xs">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">Reference ID:</span>
                <span className="font-bold text-[#00E5FF] font-mono text-sm">{successBooking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle:</span>
                <span className="font-bold text-white">{successBooking.bikeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Selected Colour:</span>
                <span className="font-bold text-white">{successBooking.variantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Showroom:</span>
                <span className="font-bold text-white">MAA Enterprises, Mahagama</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-gray-400">Financing Option:</span>
                <span className="font-bold text-emerald-400">Bajaj Finserv EMI Available</span>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[11px] text-emerald-200 max-w-md mx-auto flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Our sales team will contact you shortly from 9304456205 regarding delivery and EMI options.</span>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[#00E5FF] text-xs font-bold uppercase tracking-widest mb-1">
                <Zap className="w-4 h-4 text-[#10B981]" />
                <span>MAA Enterprises • Northstar EV</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight font-display">
                BOOK YOUR ELECTRIC SCOOTER
              </h2>
              <p className="text-xs text-gray-400">
                Reserve your Northstar EV scooter at Near SBI Bank, Mahagama.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Select Colour *</label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0a1020] text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                  required
                >
                  <option value="var_turquoise">Turquoise Edition (Flagship Hero)</option>
                  <option value="var_red">Red Edition</option>
                  <option value="var_pink">Pink Edition</option>
                  <option value="var_skyblue">Sky Blue Edition</option>
                  <option value="var_purple">Purple Edition</option>
                  <option value="var_darkblue">Dark Blue Edition</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full p-2.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="optional"
                    className="w-full p-2.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Preferred Time</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0a1020] text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none"
                  >
                    <option value="10:00 AM">10:00 AM - Morning</option>
                    <option value="12:00 PM">12:00 PM - Afternoon</option>
                    <option value="03:00 PM">03:00 PM - Afternoon</option>
                    <option value="05:30 PM">05:30 PM - Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-300 block mb-1">Notes / Enquiries</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Inquiring about Bajaj Finserv EMI terms and delivery schedule"
                  className="w-full p-2.5 rounded-xl bg-white/5 text-xs text-white border border-white/10 focus:border-[#00E5FF] focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E53935] to-[#D32F2F] hover:from-[#EF5350] hover:to-[#E53935] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Scooter Booking Enquiry...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Scooter Booking Enquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
