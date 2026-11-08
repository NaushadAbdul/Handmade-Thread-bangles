import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartItemQuantity, 
    removeFromCart, 
    cartSubtotal, 
    settings,
    currentUser,
    setIsAuthModalOpen,
    setAuthSuccessRedirect,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      setAuthSuccessRedirect('checkout');
      setIsAuthModalOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-[#f0cdd8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f3dde3] flex items-center justify-between bg-[#fdf7f9]">
          <div className="flex items-center gap-2 text-[#421724]">
            <ShoppingBag className="w-5 h-5 text-[#8c2a44]" />
            <h2 className="font-serif-luxury text-xl font-semibold">Shopping Bag ({cart.length})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#faedf1] text-[#6b2539] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#faedf1] border-b border-[#f3dde3]">
          <div className="flex items-center justify-between text-xs text-[#521b2a] font-medium mb-1.5">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#8c2a44]" />
              {amountNeededForFreeShipping === 0 
                ? '🎉 Congratulations! You have unlocked FREE Express Shipping!' 
                : `Add ₹${amountNeededForFreeShipping.toLocaleString('en-IN')} more for FREE shipping!`
              }
            </span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#e8bac7]">
            <div 
              className="h-full bg-gradient-to-r from-[#d8587b] to-[#8c2a44] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#f7e0e7] space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#faedf1] flex items-center justify-center text-[#9c3651]">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1">
                <p className="font-serif-luxury text-lg text-[#3b121e]">Your shopping bag is empty</p>
                <p className="text-xs text-[#8c4e5f] font-light max-w-xs">
                  Discover our pure silk thread bangles and bridal accessories to complete your look.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#8c2a44] text-white text-xs font-semibold hover:bg-[#721f35] transition-colors cursor-pointer"
              >
                Browse Bangles
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3.5">
                <div className="w-20 h-20 rounded-xl bg-[#fdf3f5] overflow-hidden shrink-0 border border-[#f0cdd8]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-serif-luxury text-sm font-medium text-[#3b121e] line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#8e4559] mt-0.5">
                        Size: <span className="font-semibold text-[#8c2a44]">{item.size}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#e8bac7] rounded-lg overflow-hidden bg-[#faf5f6]">
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-[#521b2a] hover:bg-[#faedf1]"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-semibold text-[#3b121e] min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-[#521b2a] hover:bg-[#faedf1]"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif-luxury text-sm font-bold text-[#8c2a44]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#f3dde3] bg-[#fdf7f9] space-y-3">
            <div className="space-y-1.5 text-xs text-[#521b2a]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {amountNeededForFreeShipping === 0 ? 'FREE' : '₹99 (Free on ₹999+)'}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-[#3b121e] pt-1.5 border-t border-[#f0cdd8]">
                <span>Total Amount</span>
                <span className="text-[#8c2a44] font-serif-luxury">
                  ₹{(cartSubtotal + (amountNeededForFreeShipping === 0 ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8c4e5f]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure UPI / QR Payments</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
