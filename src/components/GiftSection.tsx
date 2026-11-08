import React from 'react';
import { ArrowRight, Gift, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const GiftSection: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const handleExploreGiftSets = () => {
    setSelectedCategory('Gift Hampers');
    const catalogEl = document.getElementById('catalog-section');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 sm:py-16 bg-[#faf0f3] border-y border-[#f3dde3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#fae2e8] via-[#f7d6de] to-[#faedf1] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#f0cdd8] shadow-sm relative overflow-hidden">
          
          {/* Subtle floral/ribbon ambient elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Visual Box / Hamper Image */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white max-w-sm w-full group">
                <img
                  src="/assets/images/bangles_bridal_gift_box_1794119601859.jpg"
                  alt="Curated Bridal Bangle Gift Hamper Box"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-[#8c2a44] shadow-xs">
                  ✨ Includes Personalized Handwritten Gift Card
                </div>
              </div>
            </div>

            {/* Content Text */}
            <div className="lg:col-span-7 order-1 lg:order-2 text-center lg:text-left space-y-4">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#f2c7d4] text-[#8c2a44] text-xs font-medium">
                <Gift className="w-3.5 h-3.5 text-[#bd4c6d]" />
                <span>Wedding & Festive Gifting</span>
              </div>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#3b121e] leading-tight">
                The Perfect Gift for Her ♡
              </h2>

              <p className="text-sm sm:text-base text-[#683341] max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                Curated handmade silk thread bangles and matching bridal jewelry sets packaged in luxurious blush satin keepsake boxes. Tailored for weddings, Karwa Chauth, Eid, Diwali, and heartfelt bridesmaid gifts.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleExploreGiftSets}
                  className="px-7 py-3 rounded-full bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Gift Sets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
