import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { 
    isTrackingModalOpen, 
    setIsTrackingModalOpen, 
    trackingOrderId, 
    setTrackingOrderId, 
    getOrderById,
    orders,
    currentUser,
    settings,
    setInvoiceOrder
  } = useStore();

  if (!isTrackingModalOpen) return null;

  const [inputQuery, setInputQuery] = useState(trackingOrderId || (orders[0]?.id ?? ''));
  const [copiedId, setCopiedId] = useState(false);

  const matchedOrder = (inputQuery.trim() ? getOrderById(inputQuery) : undefined) || orders[0];

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const STAGES: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
    { 
      status: 'Order Placed', 
      label: 'Order Placed', 
      icon: '📝', 
      desc: 'Order confirmed & details sent to artisan studio' 
    },
    { 
      status: 'Crafting in Progress', 
      label: 'Crafting in Progress', 
      icon: '🧵', 
      desc: 'Silk thread weaving & Kundan stone setting' 
    },
    { 
      status: 'Quality Checked & Packed', 
      label: 'Quality Checked & Packed', 
      icon: '✨', 
      desc: 'Inspected and packaged in luxury velvet jewelry box' 
    },
    { 
      status: 'Shipped / In Transit', 
      label: 'Dispatched & In Transit', 
      icon: '🚚', 
      desc: 'Handed to express courier with live AWB tracking' 
    },
    { 
      status: 'Delivered', 
      label: 'Delivered', 
      icon: '🎁', 
      desc: 'Delivered safely with love' 
    },
  ];

  const getStageIndex = (currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') return -1;
    return STAGES.findIndex(s => s.status === currentStatus);
  };

  const currentStageIndex = matchedOrder ? getStageIndex(matchedOrder.status) : 0;

  const whatsappMessage = matchedOrder
    ? encodeURIComponent(`Hi ${settings.brandName}, I'm checking in on my order #${matchedOrder.id} (${matchedOrder.customerName}). Could you please share the latest update?`)
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-[#f3dde3] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f3dde3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#faedf1] text-[#8c2a44] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3b121e]">
                Real-Time Order Tracking
              </h2>
              <p className="text-xs text-[#8c4e5f] font-light">
                Follow your handcrafted bangles from artisan workshop to doorstep
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTrackingModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#faedf1] text-[#6b2539] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="py-4">
          <label className="block text-xs font-semibold text-[#521b2a] mb-1.5">
            Track by Order ID, Phone Number or Email:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#a06877] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. HTB-2026-XXXX) or phone"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const found = getOrderById(inputQuery);
                if (found) setTrackingOrderId(found.id);
              }}
              className="px-4 py-2 bg-[#8c2a44] text-white text-xs font-semibold rounded-xl hover:bg-[#721f35] transition-colors cursor-pointer"
            >
              Track
            </button>
          </div>

          {/* Quick Order chips */}
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[11px] text-[#8c4e5f] whitespace-nowrap">Recent Orders:</span>
              {orders.slice(0, 4).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setInputQuery(ord.id);
                    setTrackingOrderId(ord.id);
                  }}
                  className={`px-2 py-0.5 text-[11px] rounded-md font-mono transition-all ${
                    matchedOrder?.id === ord.id
                      ? 'bg-[#8c2a44] text-white'
                      : 'bg-[#faedf1] text-[#703b49] hover:bg-[#f7dfe6]'
                  }`}
                >
                  {ord.id}
                </button>
              ))}
            </div>
          )}
        </div>

        {matchedOrder ? (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
            
            {/* Order Overview Card */}
            <div className="bg-[#faf5f6] p-4 rounded-2xl border border-[#f0cdd8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#8c2a44]">
                    #{matchedOrder.id}
                  </span>
                  <button
                    onClick={() => handleCopyId(matchedOrder.id)}
                    className="text-gray-400 hover:text-[#8c2a44] transition-colors"
                    title="Copy Order ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    matchedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : matchedOrder.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-[#faedf1] text-[#8c2a44] border border-[#f0cdd8]'
                  }`}>
                    {matchedOrder.status}
                  </span>
                  <button
                    onClick={() => setInvoiceOrder(matchedOrder)}
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#8c2a44] border border-[#f0cdd8] hover:bg-[#faedf1] transition-colors flex items-center gap-1 cursor-pointer"
                    title="View / Download Tax Invoice"
                  >
                    <FileText className="w-3 h-3 text-[#8c2a44]" />
                    <span>Invoice</span>
                  </button>
                </div>
                <p className="text-xs text-[#703b49] mt-1">
                  Recipient: <strong>{matchedOrder.customerName}</strong> · Placed: {new Date(matchedOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[11px] text-[#8c4e5f]">Estimated Delivery</p>
                <p className="text-xs font-bold text-[#3b121e]">
                  {matchedOrder.estimatedDelivery || 'Within 4-5 Days'}
                </p>
                {matchedOrder.courierPartner && (
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {matchedOrder.courierPartner} (AWB: {matchedOrder.trackingNumber})
                  </p>
                )}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-2">
              <h4 className="text-xs font-bold text-[#3b121e] uppercase tracking-wider mb-4">
                Real-Time Journey
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#edd0d8]">
                {STAGES.map((stage, idx) => {
                  const isCompleted = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={stage.status} className="relative flex items-start gap-3">
                      {/* Circle Indicator */}
                      <div 
                        className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                          isCompleted
                            ? 'bg-[#8c2a44] text-white ring-4 ring-[#faedf1]'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{stage.icon}</span>
                          <p className={`text-xs sm:text-sm font-semibold ${
                            isCurrent ? 'text-[#8c2a44]' : isCompleted ? 'text-[#3b121e]' : 'text-gray-400'
                          }`}>
                            {stage.label}
                          </p>
                          {isCurrent && (
                            <span className="px-2 py-0.2 bg-[#f085a2] text-white text-[9px] font-bold rounded-full animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#703b49] font-light mt-0.5">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live History Log from Admin */}
            {matchedOrder.statusHistory && matchedOrder.statusHistory.length > 0 && (
              <div className="bg-[#fdf7f9] p-4 rounded-2xl border border-[#f3dde3] space-y-2">
                <p className="text-xs font-bold text-[#521b2a]">Status Timeline Logs:</p>
                <div className="space-y-1.5 text-xs text-[#703b49] divide-y divide-[#faedf1]">
                  {matchedOrder.statusHistory.map((item, i) => (
                    <div key={i} className="pt-1.5 first:pt-0 flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#8c2a44]">{item.status}: </span>
                        <span>{item.description}</span>
                        {item.location && <span className="text-[10px] text-gray-500 block">Location: {item.location}</span>}
                      </div>
                      <span className="text-[10px] text-[#a06877] shrink-0 tabular-nums">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items & Shipping Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-[#faf5f6] p-3.5 rounded-xl border border-[#f0cdd8] space-y-1">
                <p className="font-semibold text-[#3b121e] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8c2a44]" /> Shipping Address
                </p>
                <p className="text-[#551d2e]">{matchedOrder.shippingAddress.fullName}</p>
                <p className="text-[#703b49] font-light">{matchedOrder.shippingAddress.streetAddress}</p>
                {matchedOrder.shippingAddress.landmark && <p className="text-[#703b49] font-light">Landmark: {matchedOrder.shippingAddress.landmark}</p>}
                <p className="text-[#703b49] font-light">
                  {matchedOrder.shippingAddress.city}, {matchedOrder.shippingAddress.state} - {matchedOrder.shippingAddress.pincode}
                </p>
                <p className="text-[#703b49] font-light">Phone: {matchedOrder.shippingAddress.phone}</p>
              </div>

              <div className="bg-[#faf5f6] p-3.5 rounded-xl border border-[#f0cdd8] space-y-1.5">
                <p className="font-semibold text-[#3b121e] flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#8c2a44]" /> Items & Payment
                </p>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {matchedOrder.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-[#551d2e]">
                      <span className="truncate max-w-[150px]">{it.product.name} (Size: {it.size}) × {it.quantity}</span>
                      <span className="font-medium">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 border-t border-[#f0cdd8] flex justify-between font-bold text-[#8c2a44]">
                  <span>Total Paid:</span>
                  <span>₹{matchedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {matchedOrder.utrNumber && (
                  <p className="text-[10px] font-mono text-[#703b49]">
                    UPI UTR: {matchedOrder.utrNumber} ({matchedOrder.paymentStatus})
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: Download Official Invoice & WhatsApp Support */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setInvoiceOrder(matchedOrder)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#faedf1] hover:bg-[#f7dfe6] text-[#8c2a44] border border-[#f0cdd8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#8c2a44]" />
                <span>Download / Print Invoice</span>
              </button>

              <a
                href={`https://wa.me/${settings.supportWhatsApp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Artisan on WhatsApp</span>
              </a>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-[#bd4c6d] mx-auto stroke-1" />
            <p className="font-serif-luxury text-lg text-[#3b121e]">No Order Found</p>
            <p className="text-xs text-[#8c4e5f] font-light max-w-sm mx-auto">
              We couldn&apos;t find an order matching that query. Please double-check your Order ID or phone number.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
