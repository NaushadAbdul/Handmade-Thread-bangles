import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  Upload, 
  Truck, 
  Sparkles, 
  CreditCard, 
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { ShippingAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    settings, 
    currentUser, 
    createOrder,
    setIsTrackingModalOpen
  } = useStore();

  if (!isCheckoutOpen) return null;

  const [step, setStep] = useState<'address' | 'payment'>('address');

  // Customer & Shipping Info
  const [fullName, setFullName] = useState(currentUser?.displayName || currentUser?.shippingAddress?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || currentUser?.shippingAddress?.phone || '');
  const [streetAddress, setStreetAddress] = useState(currentUser?.shippingAddress?.streetAddress || '');
  const [landmark, setLandmark] = useState(currentUser?.shippingAddress?.landmark || '');
  const [city, setCity] = useState(currentUser?.shippingAddress?.city || '');
  const [state, setState] = useState(currentUser?.shippingAddress?.state || '');
  const [pincode, setPincode] = useState(currentUser?.shippingAddress?.pincode || '');
  const [customNotes, setCustomNotes] = useState(currentUser?.shippingAddress?.customNotes || '');

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<'UPI_QR' | 'COD'>('UPI_QR');
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState('');
  const [isCopiedUpi, setIsCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const freeShippingThreshold = settings.freeShippingThreshold || 999;
  const shippingFee = cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const grandTotal = cartSubtotal + shippingFee;

  // Copy UPI ID
  const copyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId);
    setIsCopiedUpi(true);
    setTimeout(() => setIsCopiedUpi(false), 2000);
  };

  // Handle Screenshot Upload (simulated data URL)
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPaymentScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }
    setErrorMsg('');
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'UPI_QR' && !utrNumber.trim()) {
      setErrorMsg('Please enter your 12-digit UPI Reference / UTR Number after scanning the QR code.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const shippingData: ShippingAddress = {
      fullName,
      email,
      phone,
      streetAddress,
      landmark,
      city,
      state,
      pincode,
      customNotes
    };

    try {
      const order = await createOrder({
        shippingAddress: shippingData,
        paymentMethod,
        utrNumber: paymentMethod === 'UPI_QR' ? utrNumber : undefined,
        paymentScreenshotUrl: paymentScreenshotUrl || undefined
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8c2a44', '#f085a2', '#f3c2d1', '#d84d72', '#ffd700']
        });
      } catch {
        // fallback
      }

      setIsSubmitting(false);
      setIsCheckoutOpen(false);
      // Automatically open tracking modal with this fresh order!
      setIsTrackingModalOpen(true);

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#f3dde3] relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#f3dde3] bg-[#fdf7f9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-xl font-bold text-[#3b121e]">
              Secure Checkout
            </span>
            <span className="text-xs text-[#8c4e5f] font-light">
              · {step === 'address' ? 'Step 1: Delivery Details' : 'Step 2: Admin QR Payment'}
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#faedf1] text-[#6b2539] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex border-b border-[#f3dde3] text-xs font-semibold text-center">
          <div className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 ${
            step === 'address' ? 'bg-[#faedf1] text-[#8c2a44] border-b-2 border-[#8c2a44]' : 'text-[#8c4e5f]'
          }`}>
            <span>1. Customer & Shipping Info</span>
          </div>
          <div className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 ${
            step === 'payment' ? 'bg-[#faedf1] text-[#8c2a44] border-b-2 border-[#8c2a44]' : 'text-[#8c4e5f]'
          }`}>
            <span>2. UPI QR Payment</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: CUSTOMER & ADDRESS DETAILS */}
        {step === 'address' && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
            
            <div className="bg-[#fcf0f3] p-3 rounded-xl border border-[#f3dde3] text-xs text-[#521b2a] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#bd4c6d] shrink-0" />
              <span>We ship handcrafted thread bangles across all Indian pin codes safely with protective jewelry packaging.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarti Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  Email Address (for order confirmation & tracking updates) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarti@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  House / Flat No., Apartment, Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Rosewood Residency, Link Road"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Near City Hospital"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai, Jaipur, Bengaluru"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra, Rajasthan"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  PIN Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 400050"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#521b2a] mb-1">
                  Custom Bridal Size / Special Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mention any custom wrist circumference in cm, wedding date, or bridal instructions..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                />
              </div>
            </div>

            {/* Bottom summary and next button */}
            <div className="pt-4 border-t border-[#f3dde3] flex items-center justify-between">
              <div>
                <p className="text-xs text-[#703b49]">Total Payable:</p>
                <p className="font-serif-luxury text-xl font-bold text-[#8c2a44]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAYMENT WITH ADMIN QR CODE */}
        {step === 'payment' && (
          <div className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setStep('address')}
              className="text-xs text-[#8c4e5f] hover:text-[#3b121e] flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Delivery Details
            </button>

            {/* Order Items Preview */}
            <div className="bg-[#faf5f6] p-3.5 rounded-2xl border border-[#f0cdd8] text-xs space-y-2">
              <div className="flex justify-between font-semibold text-[#3b121e] border-b border-[#f0cdd8] pb-1.5">
                <span>Selected Items ({cart.length})</span>
                <span>Subtotal: ₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto divide-y divide-[#f7e0e7]">
                {cart.map((item) => (
                  <div key={item.id} className="pt-1 flex justify-between text-[#551d2e]">
                    <span className="truncate max-w-[240px]">
                      {item.product.name} (Size: {item.size}) × {item.quantity}
                    </span>
                    <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[#703b49] pt-1">
                <span>Shipping:</span>
                <span className="text-emerald-700 font-semibold">{shippingFee === 0 ? 'FREE' : '₹99'}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#8c2a44] pt-1 border-t border-[#f0cdd8]">
                <span>Grand Total:</span>
                <span className="font-serif-luxury text-base">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#3b121e]">Select Payment Method:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI_QR')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    paymentMethod === 'UPI_QR'
                      ? 'border-[#8c2a44] bg-[#faedf1] ring-1 ring-[#8c2a44]'
                      : 'border-[#f0cdd8] bg-white hover:bg-[#faf5f6]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#8c2a44] text-white flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3b121e]">Admin UPI QR Code</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Instant & 100% Safe</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-[#8c2a44] bg-[#faedf1] ring-1 ring-[#8c2a44]'
                      : 'border-[#f0cdd8] bg-white hover:bg-[#faf5f6]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-stone-700 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3b121e]">Cash on Delivery</p>
                    <p className="text-[10px] text-gray-500">Pay at doorstep</p>
                  </div>
                </button>
              </div>
            </div>

            {/* ADMIN QR CODE DISPLAY BOX */}
            {paymentMethod === 'UPI_QR' && (
              <div className="bg-white p-5 rounded-2xl border-2 border-[#e8bac7] shadow-sm space-y-4">
                
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8c2a44] bg-[#faedf1] px-2.5 py-0.5 rounded-full">
                    <QrCode className="w-3.5 h-3.5" />
                    Admin Store QR Code
                  </span>
                  <p className="text-xs text-[#551d2e] font-medium">
                    Scan with any UPI app to pay <strong className="text-[#8c2a44]">₹{grandTotal.toLocaleString('en-IN')}</strong>
                  </p>
                  <p className="text-[11px] text-[#8c4e5f]">
                    Google Pay · PhonePe · Paytm · BHIM · Amazon Pay · Cred
                  </p>
                </div>

                {/* QR Code Image Container */}
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#d8899f] shadow-md inline-block">
                    <img
                      src={settings.qrCodeUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=handmadethreadbangles@okaxis'}
                      alt="Admin UPI QR Code"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-[#703b49] font-medium mt-2">
                    Payee: <strong>{settings.upiPayeeName}</strong>
                  </p>
                </div>

                {/* UPI ID copy strip & Mobile Pay App Direct Link */}
                <div className="p-3 rounded-xl bg-[#faf5f6] border border-[#f0cdd8] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-[#8c4e5f] uppercase tracking-wider font-semibold">UPI ID</p>
                    <p className="text-xs font-mono font-bold text-[#3b121e]">{settings.upiId}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#e8bac7] text-[#8c2a44] text-xs font-medium hover:bg-[#faedf1] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {isCopiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
                    </button>

                    {/* Mobile intent direct link */}
                    <a
                      href={`upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiPayeeName)}&am=${grandTotal}&cu=INR`}
                      className="px-3 py-1.5 rounded-lg bg-[#8c2a44] text-white text-xs font-medium hover:bg-[#721f35] transition-colors flex items-center gap-1"
                    >
                      <span>Pay in App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* UTR / Reference ID Field */}
                <div>
                  <label className="block text-xs font-semibold text-[#3b121e] mb-1">
                    Enter UPI Reference / UTR Number (12 digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 482910482911"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm font-mono text-[#3b121e] outline-none tracking-wider"
                  />
                  <p className="text-[10px] text-[#8c4e5f] mt-1 font-light">
                    Found in your UPI app receipt right after payment as &apos;UPI Ref ID&apos; or &apos;UTR&apos;.
                  </p>
                </div>

                {/* Payment Screenshot (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#3b121e] mb-1">
                    Upload Payment Screenshot (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#e8bac7] rounded-xl bg-[#faf5f6] hover:bg-[#faedf1] cursor-pointer transition-colors text-xs text-[#703b49]">
                    <Upload className="w-4 h-4 text-[#8c2a44]" />
                    <span>{paymentScreenshotUrl ? '✓ Screenshot Attached (Click to Change)' : 'Click to upload screenshot receipt'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>
            )}

            {/* COD Notice */}
            {paymentMethod === 'COD' && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Cash on Delivery selected</p>
                <p>Please keep exact change of <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> ready at the time of delivery.</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Order & Setting Up Live Tracking...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Place Order · ₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-[#8c4e5f]">
              By confirming, our master artisans will handcraft your bangles to your specified wrist size and dispatch with live tracking updates.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
