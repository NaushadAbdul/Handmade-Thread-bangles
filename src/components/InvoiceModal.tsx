import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { invoiceOrder, setInvoiceOrder, settings } = useStore();

  if (!invoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(invoiceOrder.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Background click to close (disabled in print) */}
      <div 
        className="fixed inset-0 print:hidden" 
        onClick={() => setInvoiceOrder(null)} 
      />

      {/* Main Invoice Card Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#f0cdd8] overflow-hidden my-auto z-10 print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar (Screen only) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#faf5f6] border-b border-[#f0cdd8] print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#faedf1] text-[#8c2a44]">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-base font-bold text-[#3b121e]">
                Official Order Tax Invoice
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#8c4e5f]">
                Invoice #{invoiceOrder.id} · Generated for Customer & Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => setInvoiceOrder(null)}
              className="p-1.5 sm:p-2 rounded-full hover:bg-white text-gray-400 hover:text-gray-700 transition-colors"
              title="Close Invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-4 sm:p-8 md:p-10 bg-white text-[#333] space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Header with Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-[#8c2a44]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#8c2a44] tracking-tight">
                  Ambition by Sha
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#faedf1] text-[#8c2a44] px-2 py-0.5 rounded-full border border-[#f0cdd8]">
                  Handmade Studio
                </span>
              </div>
              <p className="text-xs text-[#703b49] font-medium mt-0.5">
                Handcrafted Silk Thread Bangles, Kundan Bridal Sets & Accessories
              </p>
              
              <div className="text-[11px] text-gray-600 mt-2 space-y-0.5">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8c2a44]" />
                  <span>Artisan Studio, Vijayawada, Andhra Pradesh, India</span>
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#8c2a44]" />
                  <span>WhatsApp: {settings.supportWhatsApp || '+91 73964 53236'}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#8c2a44]" />
                  <span>Email: {settings.supportEmail || 'craftedbangles272@gmail.com'}</span>
                </p>
                <p className="text-[10px] font-mono text-[#8c2a44]">
                  UPI VPA: {settings.upiId || 'ambitionbysha@axl'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right sm:self-start bg-[#faf5f6] sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8c2a44] block">
                TAX INVOICE / CASH MEMO
              </span>
              <p className="font-mono text-base font-bold text-[#3b121e] mt-1">
                INV-{invoiceOrder.id}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Order Date: <strong>{formattedDate}</strong>
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                <span>Payment: {invoiceOrder.paymentStatus}</span>
              </div>
            </div>
          </div>

          {/* 2. Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf5f6] p-4 rounded-2xl border border-[#f0cdd8] text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#8c2a44] mb-1">
                Billed & Shipped To:
              </p>
              <p className="text-sm font-bold text-[#3b121e]">
                {invoiceOrder.customerName}
              </p>
              <p className="text-gray-600 mt-0.5">
                Phone: <strong>{invoiceOrder.phone}</strong>
              </p>
              {invoiceOrder.email && (
                <p className="text-gray-600">
                  Email: {invoiceOrder.email}
                </p>
              )}
              <div className="mt-2 text-gray-700 leading-relaxed">
                <p className="font-medium">Shipping Address:</p>
                <p>{invoiceOrder.shippingAddress.streetAddress}</p>
                {invoiceOrder.shippingAddress.landmark && (
                  <p>Landmark: {invoiceOrder.shippingAddress.landmark}</p>
                )}
                <p>
                  {invoiceOrder.shippingAddress.city}, {invoiceOrder.shippingAddress.state} - {invoiceOrder.shippingAddress.pincode}
                </p>
              </div>
              {invoiceOrder.shippingAddress.customNotes && (
                <p className="mt-2 text-[11px] bg-white p-2 rounded-lg border border-[#f0cdd8] text-[#703b49]">
                  <strong>Artisan Note:</strong> {invoiceOrder.shippingAddress.customNotes}
                </p>
              )}
            </div>

            <div className="sm:border-l sm:border-[#f0cdd8] sm:pl-4 space-y-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#8c2a44] mb-1">
                Payment & Dispatch Summary:
              </p>
              
              <div className="space-y-1.5 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Mode:</span>
                  <span className="font-semibold text-[#3b121e]">
                    {invoiceOrder.paymentMethod === 'UPI_QR' ? 'UPI QR / App Payment' : invoiceOrder.paymentMethod}
                  </span>
                </div>

                {invoiceOrder.utrNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">UPI Ref / UTR No:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {invoiceOrder.utrNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Order Stage:</span>
                  <span className="font-medium text-[#8c2a44]">{invoiceOrder.status}</span>
                </div>

                {invoiceOrder.courierPartner && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courier Partner:</span>
                    <span className="font-medium text-[#3b121e]">{invoiceOrder.courierPartner}</span>
                  </div>
                )}

                {invoiceOrder.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">AWB Tracking #:</span>
                    <span className="font-mono font-medium text-[#3b121e]">{invoiceOrder.trackingNumber}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Delivery:</span>
                  <span className="text-gray-700">{invoiceOrder.estimatedDelivery || 'Within 4-6 business days'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Ordered Items Table with Images & Product Codes */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#8c2a44] text-[#8c2a44] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Product Image</th>
                  <th className="py-2.5 px-2">Product Description</th>
                  <th className="py-2.5 px-2">Product Code</th>
                  <th className="py-2.5 px-2">Size</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f7e0e7]">
                {invoiceOrder.items.map((it, idx) => (
                  <tr key={it.id || idx} className="hover:bg-[#faf5f6]/50">
                    <td className="py-3 px-2 text-gray-500 font-mono text-[11px] align-middle">
                      {idx + 1}
                    </td>
                    
                    {/* Ordered Product Image */}
                    <td className="py-3 px-2 align-middle">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#f0cdd8] bg-white flex-shrink-0 shadow-xs">
                        <img 
                          src={it.product.image} 
                          alt={it.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611591475152-478d13b6676f?auto=format&fit=crop&w=150&q=80';
                          }}
                        />
                      </div>
                    </td>

                    {/* Product Name & Category */}
                    <td className="py-3 px-2 align-middle">
                      <p className="font-bold text-[#3b121e] text-xs">
                        {it.product.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Category: {it.product.category || 'Handmade Bangles'}
                      </p>
                      {it.product.material && (
                        <p className="text-[9px] text-[#8c4e5f] italic">
                          {it.product.material}
                        </p>
                      )}
                    </td>

                    {/* Product Code / SKU */}
                    <td className="py-3 px-2 font-mono text-[11px] text-[#8c2a44] font-semibold align-middle">
                      {it.product.id || `SKU-${idx + 101}`}
                    </td>

                    {/* Wrist Size */}
                    <td className="py-3 px-2 align-middle">
                      <span className="px-2 py-0.5 rounded-md bg-[#faedf1] text-[#8c2a44] font-bold text-[11px] border border-[#f0cdd8]">
                        {it.size}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-2 text-right font-medium text-gray-700 align-middle">
                      ₹{it.product.price.toLocaleString('en-IN')}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-2 text-center font-bold text-[#3b121e] align-middle">
                      {it.quantity}
                    </td>

                    {/* Line Total */}
                    <td className="py-3 px-2 text-right font-bold text-[#8c2a44] align-middle">
                      ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Financial Calculations & Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-[#f0cdd8]">
            <div className="text-[11px] text-gray-500 max-w-sm space-y-1">
              <p className="font-semibold text-[#8c2a44] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Artisan Quality & Authenticity Guarantee
              </p>
              <p>
                Each piece is carefully woven with premium silk thread and embedded with hand-picked stones.
                Protected in a boutique keepsake package.
              </p>
              <p className="italic text-[10px] text-gray-400">
                Care instructions: Store in dry box. Avoid direct contact with water and perfume sprays.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs bg-[#faf5f6] p-4 rounded-xl border border-[#f0cdd8]">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal:</span>
                <span className="font-medium text-gray-800">
                  ₹{invoiceOrder.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping & Packaging:</span>
                <span className="font-medium text-gray-800">
                  {invoiceOrder.shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${invoiceOrder.shippingFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax / GST:</span>
                <span className="text-gray-500">₹0 (Included)</span>
              </div>

              <div className="pt-2 border-t-2 border-[#8c2a44] flex justify-between font-bold text-sm text-[#8c2a44]">
                <span>Total Amount:</span>
                <span>₹{invoiceOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <p className="text-[10px] text-right text-emerald-700 font-semibold pt-0.5">
                Payment Status: Paid & Recorded
              </p>
            </div>
          </div>

          {/* 5. Stamp / Signature & Footer */}
          <div className="pt-6 border-t border-[#f7e0e7] flex flex-col sm:flex-row justify-between items-end gap-4 text-xs text-gray-500">
            <div>
              <p className="font-bold text-[#3b121e]">Ambition by Sha · Artisan Boutique</p>
              <p className="text-[11px] text-gray-400">This is an officially recorded computer-generated invoice.</p>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="h-10 flex items-center justify-center sm:justify-end">
                <span className="font-serif-luxury italic text-sm text-[#8c2a44] font-semibold border-b border-[#8c2a44] px-4 pb-0.5">
                  Ambition by Sha
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-1">Authorized Artisan Signature</p>
            </div>
          </div>

        </div>

        {/* Bottom Screen-Only Action Bar */}
        <div className="p-4 bg-[#faf5f6] border-t border-[#f0cdd8] flex justify-end gap-3 print:hidden">
          <button
            onClick={() => setInvoiceOrder(null)}
            className="px-4 py-2 rounded-xl border border-[#e8bac7] text-xs font-semibold text-[#521b2a] hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Invoice (PDF)</span>
          </button>
        </div>

      </div>

      {/* Global Print-specific CSS injected for zero-margin clean print */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          /* Hide everything except the invoice modal */
          header, footer, nav, #root > *:not(.fixed) {
            display: none !important;
          }
          #printable-invoice {
            padding: 10px !important;
            margin: 0 !important;
            border: none !important;
            width: 100% !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

