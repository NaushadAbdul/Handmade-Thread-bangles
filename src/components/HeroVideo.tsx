import React, { useRef } from 'react';
import { Sparkles, ArrowRight, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroVideo: React.FC = () => {
  const { settings, setIsSizeGuideOpen, setSelectedCategory } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToCatalog = () => {
    setSelectedCategory('All Bangles');
    const catalogEl = document.getElementById('catalog-section');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faedf1] via-[#f7e2e8] to-[#faf5f6] py-10 sm:py-16 lg:py-20 border-b border-[#f0d4dd]">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#fbd4df]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f3c2d1]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#f2c7d4] text-[#862943] text-xs font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#bd4c6d]" />
              <span>Artisan Handcrafted Heritage</span>
              <span className="text-[#d893a7]">·</span>
              <span>Pure Silk & Kundan</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#3b121e] tracking-tight leading-[1.18] sm:leading-[1.15]">
                {settings.heroHeadline}
              </h1>
              <p className="font-serif-luxury italic text-base sm:text-xl md:text-2xl text-[#8e4559] font-light">
                Elegant · Chic · Everyday
              </p>
            </div>

            <p className="text-xs sm:text-base text-[#613340] max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {settings.heroSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-full bg-white/90 hover:bg-white text-[#6b2539] border border-[#e8bac7] text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-[#a83a58]" />
                <span>Bangle Size Guide</span>
              </button>
            </div>

            {/* Trust bullet markers */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-[#703b49]">
              <div className="flex items-center gap-1.5 bg-white/60 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full border sm:border-0 border-[#f2c7d4]/60">
                <span className="text-[#a83a58] font-bold">✓</span>
                <span>Custom Wrist Sizing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full border sm:border-0 border-[#f2c7d4]/60">
                <span className="text-[#a83a58] font-bold">✓</span>
                <span>Direct UPI / QR Payments</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-full border sm:border-0 border-[#f2c7d4]/60">
                <span className="text-[#a83a58] font-bold">✓</span>
                <span>Live Order Tracking</span>
              </div>
            </div>

          </div>

          {/* Right Video Showcase Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-stone-900 group">
              
              {/* Actual Video */}
              <video
                ref={videoRef}
                src="/assets/aistudio/Woman_admiring_gold_glass_bangles_b09230af_1080p_088b10ff.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-[280px] sm:h-[400px] lg:h-[460px] object-cover object-center"
              />

              {/* Subtle Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

              {/* Video Badge */}
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#f085a2] animate-pulse" />
                  Live Preview: Silk Thread Adornment
                </span>
              </div>

              {/* Subtle Bottom Brand Label */}
              <div className="absolute bottom-4 right-4 z-20 text-right text-white drop-shadow-md">
                <p className="text-xs font-medium tracking-wide">Ambitionbysha</p>
                <p className="text-[10px] text-pink-200">100% Handcrafted Elegance</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
