import React from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/initialData';

interface CategoryMeta {
  emoji: string;
  description: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  'All Bangles': { emoji: '✨', description: 'Complete Collection' },
  'Earrings': { emoji: '💎', description: 'Handcrafted Earrings' },
  'Silk Thread Bangles': { emoji: '🧵', description: 'Pure Mulberry Silk' },
  'Kundan Bridal Chooda': { emoji: '👑', description: 'Royal Wedding Sets' },
  'Zari Velvet Bangles': { emoji: '💫', description: 'Golden Metallic Thread' },
  'Pearl Kada & Latkan': { emoji: '🪡', description: 'Tassel & Jhumka Drop' },
  'Baby & Kids Bangles': { emoji: '🌸', description: 'Soft Skin-Safe Core' },
  'Festive Sets': { emoji: '🦚', description: 'Festival & Occasion' },
  'Gift Hampers': { emoji: '🎁', description: 'Luxury Gift Packaging' },
};

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, categories } = useStore();

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    const catalogEl = document.getElementById('catalog-section');
    catalogEl?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-10 bg-[#faf5f6] border-b border-[#f3dde3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Section Heading with decorative bow/divider */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-[1px] w-12 sm:w-20 bg-[#e2b0bf]" />
          <span className="text-xl text-[#b44865]">୨ৎ</span>
          <div className="h-[1px] w-12 sm:w-20 bg-[#e2b0bf]" />
        </div>

        <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#3b121e] tracking-tight mb-2">
          Shop by Category
        </h2>
        <p className="text-xs sm:text-sm text-[#8c4e5f] max-w-md mx-auto mb-8 font-light">
          Browse our handmade artisanal creations tailored for every celebration & wrist size
        </p>

        {/* Scrollable Categories List */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar px-2">
          {categories.map((catName) => {
            const isSelected = selectedCategory === catName;
            const meta = CATEGORY_META[catName] || { emoji: '✨', description: 'Handmade Collection' };
            return (
              <button
                key={catName}
                onClick={() => handleCategorySelect(catName)}
                className="flex flex-col items-center group shrink-0 focus:outline-none transition-transform active:scale-95 cursor-pointer"
              >
                {/* Rounded Pod Icon */}
                <div 
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 shadow-sm ${
                    isSelected 
                      ? 'bg-[#8c2a44] text-white shadow-md scale-105 ring-2 ring-[#e698ae] ring-offset-2' 
                      : 'bg-white hover:bg-[#faeaf0] text-[#782c40] border border-[#f0cdd8] hover:border-[#e29db1] hover:-translate-y-1'
                  }`}
                >
                  <span>{meta.emoji}</span>
                </div>

                {/* Category Label */}
                <span 
                  className={`mt-2.5 text-xs sm:text-sm font-medium tracking-tight whitespace-nowrap transition-colors max-w-[100px] truncate ${
                    isSelected ? 'text-[#8c2a44] font-bold' : 'text-[#5a2433] group-hover:text-[#8c2a44]'
                  }`}
                >
                  {catName}
                </span>

                <span className="text-[10px] text-[#a06877] hidden sm:block max-w-[90px] truncate font-light">
                  {meta.description}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
