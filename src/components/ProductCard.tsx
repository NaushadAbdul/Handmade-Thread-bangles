import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product, BangleSize } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isInWishlist, toggleWishlist, setSelectedProductForQuickView } = useStore();
  const [selectedSize, setSelectedSize] = useState<BangleSize>(product.sizes[0] || '2.4');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={() => setSelectedProductForQuickView(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-[#f3dde3] hover:border-[#e2a8ba] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Heart Wishlist & Badges */}
      <div className="relative aspect-[4/3] sm:aspect-square bg-[#fbf3f5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // graceful fallback
            (e.target as HTMLImageElement).src = '/assets/images/bangles_silk_kundan_set_1794119599359.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.bestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#8c2a44] text-white text-[10px] font-semibold tracking-wide shadow-sm">
              Bestseller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-semibold tracking-wide shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-sm z-10 cursor-pointer ${
            isFavorited 
              ? 'bg-[#d84d72] text-white' 
              : 'bg-white/90 hover:bg-white text-[#703b49] hover:text-[#d84d72]'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Peek */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-[#521b2a] rounded-full shadow-sm">
            <Eye className="w-3.5 h-3.5" /> Quick Details
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#8e4559] mb-1">
            <span className="font-medium tracking-wide uppercase">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount || 40})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#3b121e] line-clamp-1 group-hover:text-[#9e2f4c] transition-colors">
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#704250] line-clamp-2 mt-1 leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Size Selection */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1 text-[11px] text-[#6b3544]">
            <span className="font-medium">Size (Indian Dia):</span>
            <span className="text-[#a04e63] font-semibold">{selectedSize}</span>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          >
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-0.5 text-[11px] rounded-md font-medium transition-all ${
                  selectedSize === size
                    ? 'bg-[#8c2a44] text-white shadow-xs'
                    : 'bg-[#faedf1] text-[#682a3b] hover:bg-[#f7dfe6]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-[#faedf1] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-luxury text-lg sm:text-xl font-bold text-[#8c2a44]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through font-light">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              In Stock · Handcrafted
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-[#d8587b] hover:bg-[#bd3f61] text-white'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
