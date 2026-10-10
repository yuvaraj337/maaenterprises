'use client';

import React, { useState } from 'react';
import { ShoppingBag, Wrench, PackageCheck, CreditCard, CheckCircle2, Phone, Calendar, ArrowRight, MessageSquare } from 'lucide-react';

interface ServiceSectionProps {
  onOpenVisitModal?: () => void;
}

const SERVICES_LIST = [
  {
    icon: ShoppingBag,
    title: 'Electric Scooter Sales',
    description:
      'Explore the available Northstar EV scooter colour options and enquire about purchasing. Walk into our Mahagama showroom to see our full inventory.',
    color: '#00E5FF',
    badge: 'Sales & Enquiries',
  },
  {
    icon: Wrench,
    title: 'Service & Maintenance',
    description:
      'Contact the dealership for electric scooter service and maintenance enquiries. Keep your electric two-wheeler riding safely and reliably.',
    color: '#10B981',
    badge: 'Dealership Care',
  },
  {
    icon: PackageCheck,
    title: 'Genuine Spare Parts',
    description:
      'Enquire about spare parts availability for supported scooters. Ensure authentic quality and seamless component compatibility.',
    color: '#F59E0B',
    badge: 'Parts Support',
  },
  {
    icon: CreditCard,
    title: 'EMI Enquiries',
    description:
      'Ask about the Bajaj Finserv EMI option advertised by the dealership. Enquire about documentation and financing options at our showroom.',
    color: '#E53935',
    badge: 'Bajaj Finserv',
  },
];

export default function ServiceSection({ onOpenVisitModal }: ServiceSectionProps) {
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryType, setEnquiryType] = useState('Electric Scooter Sales');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryPhone) return;

    // Send enquiry directly via WhatsApp / submit
    const text = encodeURIComponent(
      `Hello MAA Enterprises! My name is ${enquiryName || 'Customer'} (Phone: ${enquiryPhone}). I have an enquiry regarding ${enquiryType}.`
    );
    window.open(`https://wa.me/919304456205?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="services" className="relative py-24 bg-[#07090E] border-t border-white/5 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#00E5FF]/30 backdrop-blur-md mb-3 text-[#00E5FF] text-xs font-bold uppercase tracking-widest">
            <Wrench className="w-3.5 h-3.5 text-[#10B981]" />
            Complete Dealership Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white font-display tracking-tight leading-tight">
            DEALERSHIP SERVICES <br />
            <span className="hero-text-turquoise hero-text-glow-turquoise">& CUSTOMER CARE</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-medium max-w-xl mx-auto">
            MAA Enterprises provides comprehensive electric scooter sales, certified maintenance, genuine spare parts, and convenient Bajaj Finserv EMI guidance.
          </p>
        </div>

        {/* 4 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {SERVICES_LIST.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="rounded-2xl bg-gradient-to-b from-[#0c121e] to-[#07090e] border border-white/10 hover:border-white/25 p-6 flex flex-col justify-between shadow-xl transition-all hover:scale-[1.02] text-left group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${s.color}15`,
                        borderColor: `${s.color}40`,
                        color: s.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${s.color}10`,
                        borderColor: `${s.color}30`,
                        color: s.color,
                      }}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white uppercase font-display mb-2.5">
                    {s.title}
                  </h3>

                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {s.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                  <a
                    href="tel:9304456205"
                    className="text-[11px] font-bold uppercase tracking-wider text-[#00E5FF] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Enquire Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fast Service / EMI Enquiry Card */}
        <div className="rounded-3xl bg-gradient-to-r from-black via-[#0d1424] to-black border border-[#00E5FF]/30 p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00E5FF] block mb-2">
                DIRECT ENQUIRY
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase font-display mb-3">
                Have a Question for Our Team?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                Whether you wish to enquire about Northstar EV colour availability, request maintenance, or ask about Bajaj Finserv EMI terms, our team at Mahagama is here to assist.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Quick Response
                </span>
                <span className="flex items-center gap-1.5 text-[#00E5FF]">
                  <CheckCircle2 className="w-4 h-4" />
                  WhatsApp Direct
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-white mb-1">Enquiry Connected!</h4>
                  <p className="text-xs text-gray-300">
                    Your request has been initiated. Our team at MAA Enterprises will get in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Service / Enquiry Type
                    </label>
                    <select
                      value={enquiryType}
                      onChange={(e) => setEnquiryType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a1020] border border-white/10 text-white text-xs focus:outline-none focus:border-[#00E5FF]"
                    >
                      <option value="Electric Scooter Sales">Electric Scooter Sales</option>
                      <option value="Service & Maintenance">Service & Maintenance</option>
                      <option value="Genuine Spare Parts">Genuine Spare Parts</option>
                      <option value="Bajaj Finserv EMI Enquiry">Bajaj Finserv EMI Enquiry</option>
                      <option value="Showroom Visit Request">Showroom Visit Request</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#10B981] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send Enquiry via WhatsApp</span>
                    </button>
                    <a
                      href="tel:9304456205"
                      className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#10B981]" />
                      <span>Call Directly</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
