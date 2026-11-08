import React from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface BangleSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BangleSizeGuideModal: React.FC<BangleSizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const SIZES = [
    { size: '2.2', diaInches: '2.125"', diaMm: '54.0 mm', wristCirc: '6.67 in (17.0 cm)', note: 'Petite / Teen' },
    { size: '2.4', diaInches: '2.250"', diaMm: '57.2 mm', wristCirc: '7.06 in (17.9 cm)', note: 'Small (Popular)' },
    { size: '2.6', diaInches: '2.375"', diaMm: '60.3 mm', wristCirc: '7.45 in (18.9 cm)', note: 'Standard Medium (Most Popular)' },
    { size: '2.8', diaInches: '2.500"', diaMm: '63.5 mm', wristCirc: '7.85 in (19.9 cm)', note: 'Large (Popular for Bridal Sets)' },
    { size: '2.10', diaInches: '2.625"', diaMm: '66.7 mm', wristCirc: '8.24 in (20.9 cm)', note: 'Extra Large / Broad Hand' },
    { size: 'Custom Bridal', diaInches: 'Custom', diaMm: 'Tailored', wristCirc: 'As per measurement', note: 'Specify in Order Notes' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#f3dde3] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#faedf1] text-[#551d2e] hover:bg-[#f7dfe6] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-[#8c2a44] mb-2">
          <Ruler className="w-6 h-6" />
          <h2 className="font-serif-luxury text-2xl font-semibold">Indian Bangle Sizing Chart</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#703b49] mb-6 font-light">
          Use an existing well-fitting bangle or measure the inner diameter in millimeters to find your perfect fit.
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#f0cdd8] mb-6">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#fcecf1] text-[#421724] font-semibold border-b border-[#f0cdd8]">
              <tr>
                <th className="py-2.5 px-3">Size Code</th>
                <th className="py-2.5 px-3">Inner Diameter (mm)</th>
                <th className="py-2.5 px-3">Inner Diameter (Inches)</th>
                <th className="py-2.5 px-3">Fit Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f7e0e7] text-[#551d2e]">
              {SIZES.map((row) => (
                <tr key={row.size} className="hover:bg-[#fdf7f9]">
                  <td className="py-2 px-3 font-bold text-[#8c2a44]">{row.size}</td>
                  <td className="py-2 px-3 tabular-nums">{row.diaMm}</td>
                  <td className="py-2 px-3 tabular-nums">{row.diaInches}</td>
                  <td className="py-2 px-3 text-[#773345]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Instructions */}
        <div className="bg-[#faf5f6] p-4 rounded-2xl border border-[#f0cdd8] text-xs text-[#521b2a] space-y-2">
          <p className="font-semibold text-sm text-[#3b121e]">✨ How to Measure at Home:</p>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#a83253] shrink-0 mt-0.5" />
            <span><strong>Method 1 (Best):</strong> Take a rigid bangle that fits you comfortably. Measure the exact straight inner diameter from inside edge to inside edge in millimeters using a standard ruler.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#a83253] shrink-0 mt-0.5" />
            <span><strong>Method 2 (Hand Span):</strong> Bring your thumb and little finger together as if sliding on a bangle. Wrap a strip of paper around the widest part of your hand knuckles, mark the point, and measure length.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#a83253] shrink-0 mt-0.5" />
            <span><strong>Custom Bridal Sizes:</strong> If you have different sizes for your upper forearm vs wrist, select <em>Custom Bridal</em> and add notes during checkout. Our artisans will customize it at no extra cost!</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#8c2a44] text-white text-xs sm:text-sm font-semibold hover:bg-[#721f35] transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>

      </div>
    </div>
  );
};
