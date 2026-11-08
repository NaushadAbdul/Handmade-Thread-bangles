import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ValueProps: React.FC = () => {
  const { settings } = useStore();

  const PROPS = [
    {
      icon: <Truck className="w-6 h-6 text-[#8c2a44]" />,
      title: 'Free Shipping',
      desc: `On all orders above ₹${settings.freeShippingThreshold || 999}`
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#8c2a44]" />,
      title: 'Secure Payments',
      desc: '100% Safe & Instant UPI QR'
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#8c2a44]" />,
      title: 'Custom Sizing & Exchange',
      desc: '7-Day Hassle-Free Size Guarantee'
    },
    {
      icon: <Headphones className="w-6 h-6 text-[#8c2a44]" />,
      title: 'Artisan Support',
      desc: `Direct WhatsApp: ${settings.supportWhatsApp}`
    }
  ];

  return (
    <section className="py-8 bg-white border-b border-[#f3dde3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PROPS.map((item, i) => (
            <div key={i} className="flex items-center gap-3.5 p-2">
              <div className="w-12 h-12 rounded-2xl bg-[#faedf1] border border-[#f3dde3] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#3b121e] leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#8c4e5f] font-light">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
