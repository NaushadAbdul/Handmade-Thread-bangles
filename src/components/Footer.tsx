import React, { useState } from 'react';
import { Mail, ArrowRight, Heart, Phone, MapPin, Settings, Check, Truck, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { 
    settings, 
    currentUser,
    setIsAdminOpen, 
    setIsTrackingModalOpen, 
    setIsSizeGuideOpen,
    setSelectedCategory 
  } = useStore();

  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailSub('');
      setSubscribed(false);
    }, 3000);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    const catalogEl = document.getElementById('catalog-section');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="about" className="bg-[#f7ebef] border-t border-[#f0cdd8] text-[#551d2e] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Newsletter Banner - Exactly from reference image */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd0d8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3b121e]">
              Join the Handmade Thread bangles Club ♡
            </h3>
            <p className="text-xs sm:text-sm text-[#8c4e5f] font-light mt-0.5">
              Get exclusive bridal offers, new thread collections & custom styling tips.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center max-w-md">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-[#a06877] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailSub}
                onChange={(e) => setEmailSub(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-l-full text-xs text-[#3b121e] outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 rounded-r-full bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs font-semibold tracking-wide transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Joined!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 4 Columns Links & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-xl font-bold text-[#3b121e]">
              {settings.brandName}
            </h4>
            <p className="text-[#703b49] font-light leading-relaxed">
              Every single bangle is meticulously hand-wound with pure mulberry silk thread and hand-embellished with authentic Kundan stones and seed pearls by our heritage artisans.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#8c2a44] font-medium pt-1">
              <span>Made with love in Jaipur, India</span>
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#3b121e] uppercase tracking-wider text-xs">
              Collections
            </h5>
            <ul className="space-y-1.5 text-[#703b49]">
              <li>
                <button onClick={() => handleCategoryClick('Silk Thread Bangles')} className="hover:text-[#8c2a44] transition-colors">
                  Silk Thread Bangles
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Kundan Bridal Chooda')} className="hover:text-[#8c2a44] transition-colors">
                  Kundan Bridal Chooda
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Zari Velvet Bangles')} className="hover:text-[#8c2a44] transition-colors">
                  Zari Velvet Kada Stacks
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Pearl Kada & Latkan')} className="hover:text-[#8c2a44] transition-colors">
                  Pearl Kada & Latkans
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Gift Hampers')} className="hover:text-[#8c2a44] transition-colors">
                  Bridal Gift Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Real-Time Tracking */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#3b121e] uppercase tracking-wider text-xs">
              Customer Care
            </h5>
            <ul className="space-y-1.5 text-[#703b49]">
              <li>
                <button 
                  onClick={() => setIsTrackingModalOpen(true)}
                  className="hover:text-[#8c2a44] transition-colors font-semibold text-[#8c2a44] flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Real-Time Order Tracking</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="hover:text-[#8c2a44] transition-colors flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Bangle Sizing Chart (2.2 - 2.10)</span>
                </button>
              </li>
              <li>
                <span className="text-[#703b49]">Delivery: 4-6 Business Days</span>
              </li>
              <li>
                <span className="text-[#703b49]">Payments: UPI QR (Zero Processing Fee)</span>
              </li>
              <li>
                <span className="text-[#703b49]">7-Day Size Exchange Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Contact & Artisan Workshop */}
          <div className="space-y-2.5">
            <h5 className="font-bold text-[#3b121e] uppercase tracking-wider text-xs">
              Artisan Workshop & Support
            </h5>
            <p className="text-[#703b49] font-light">
              Have a custom bridal color request or need urgent wedding orders?
            </p>
            <div className="space-y-1.5 text-[#551d2e] pt-1">
              <a 
                href={`https://wa.me/${settings.supportWhatsApp.replace(/[^0-9]/g, '')}`} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-800 font-semibold hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: {settings.supportWhatsApp}</span>
              </a>
              <p className="flex items-center gap-2 text-[#703b49]">
                <Mail className="w-3.5 h-3.5 text-[#8c2a44]" />
                <span>{settings.supportEmail}</span>
              </p>
              <p className="flex items-center gap-2 text-[#703b49]">
                <MapPin className="w-3.5 h-3.5 text-[#8c2a44]" />
                <span>Jaipur Artisan Hub, Rajasthan</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom row with copyright & Admin quick trigger */}
        <div className="pt-6 border-t border-[#f0cdd8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8c4e5f]">
          <p>
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved. Handcrafted with passion.
          </p>

          <div className="flex items-center gap-4">
            {currentUser?.isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="hover:text-[#8c2a44] transition-colors flex items-center gap-1 font-semibold text-[#8c2a44] bg-[#faedf1] px-2.5 py-1 rounded-md border border-[#edd0d8]"
              >
                <Settings className="w-3 h-3 text-[#8c2a44]" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
