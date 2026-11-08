import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Ruler, Sparkles } from 'lucide-react';
import { Product, BangleSize } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart, isInWishlist, toggleWishlist, setIsSizeGuideOpen } = useStore();
  
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<BangleSize>(product.sizes[0] || '2.4');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#f3dde3] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#551d2e] hover:bg-[#faedf1] z-20 transition-colors shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Side */}
          <div className="relative bg-[#fdf3f5] aspect-[4/3] md:aspect-auto h-72 md:h-full">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {product.bestseller && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#8c2a44] text-white text-xs font-semibold shadow-sm">
                Bestseller
              </span>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8e4559]">
                <span className="font-semibold uppercase tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-600 font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating || '4.9'}</span>
                  <span>({product.reviewCount || 42} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-2xl text-[#3b121e] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3">
                <span className="font-serif-luxury text-2xl font-bold text-[#8c2a44]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through font-light">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                  Free Shipping Eligible
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#613340] leading-relaxed font-light">
                {product.description}
              </p>

              {/* Crafting & Material Specs */}
              <div className="p-3 bg-[#faf5f6] rounded-xl border border-[#f3dde3] text-xs text-[#521b2a] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#bd4c6d]" />
                  <span><strong>Material:</strong> {product.material || 'Pure Mulberry Silk & Premium Base'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#bd4c6d]" />
                  <span><strong>Crafting Time:</strong> {product.craftingTime || '2-3 Days Handcrafted'}</span>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2 text-[#551d2e]">
                  <span className="font-medium">Select Bangle Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#a04e63] hover:underline flex items-center gap-1 text-[11px] font-medium"
                  >
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#8c2a44] text-white border-[#8c2a44] shadow-xs'
                          : 'bg-white text-[#551d2e] border-[#f0cdd8] hover:bg-[#fcf0f3]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-[#551d2e]">Quantity:</span>
                <div className="flex items-center border border-[#e8bac7] rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-[#551d2e] hover:bg-[#fcf0f3]"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-semibold text-[#3b121e] min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm text-[#551d2e] hover:bg-[#fcf0f3]"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#f3dde3] flex items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  added ? 'bg-emerald-600 text-white' : 'bg-[#d8587b] hover:bg-[#c44367] text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Added to Bag!' : `Add to Bag · ₹${(product.price * quantity).toLocaleString('en-IN')}`}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isFavorited
                    ? 'bg-[#faedf1] border-[#d84d72] text-[#d84d72]'
                    : 'border-[#f0cdd8] text-[#703b49] hover:bg-[#faedf1]'
                }`}
                title={isFavorited ? 'Remove Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
