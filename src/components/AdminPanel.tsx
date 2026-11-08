import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  QrCode, 
  Package, 
  ShoppingBag, 
  Truck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Upload, 
  Image as ImageIcon,
  DollarSign, 
  Globe, 
  AlertCircle,
  ExternalLink,
  Eye,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, BangleSize, Product } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus,
    deleteOrder,
    clearAllOrders, 
    setInvoiceOrder,
    settings, 
    updateSettings,
    categories,
    addCategory,
    deleteCategory,
    firestoreStatus,
    syncProductCatalogToCloud
  } = useStore();

  const [copiedRule, setCopiedRule] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [syncCloudSuccess, setSyncCloudSuccess] = useState(false);

  const handleCopyFirestoreRule = () => {
    const ruleText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
    navigator.clipboard.writeText(ruleText);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 3000);
  };

  const handleManualCloudSync = async () => {
    setSyncingCloud(true);
    try {
      await syncProductCatalogToCloud();
      setSyncCloudSuccess(true);
      setTimeout(() => setSyncCloudSuccess(false), 3000);
    } catch (e: any) {
      alert('Could not sync to Firebase yet. Please check Firestore security rules: ' + (e?.message || 'Permission denied'));
    } finally {
      setSyncingCloud(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'qr_payments' | 'orders' | 'products' | 'store_settings'>('qr_payments');

  // QR Code & Payment editing state
  const [upiIdInput, setUpiIdInput] = useState(settings.upiId);
  const [payeeNameInput, setPayeeNameInput] = useState(settings.upiPayeeName);
  const [qrCodeUrlInput, setQrCodeUrlInput] = useState(settings.qrCodeUrl);
  const [qrSaveSuccess, setQrSaveSuccess] = useState(false);

  // Store settings state
  const [brandNameInput, setBrandNameInput] = useState(settings.brandName);
  const [taglineInput, setTaglineInput] = useState(settings.tagline);
  const [announcementInput, setAnnouncementInput] = useState(settings.announcementText);
  const [freeShippingThresholdInput, setFreeShippingThresholdInput] = useState(settings.freeShippingThreshold);
  const [whatsAppInput, setWhatsAppInput] = useState(settings.supportWhatsApp);
  const [heroHeadlineInput, setHeroHeadlineInput] = useState(settings.heroHeadline);
  const [heroSubtitleInput, setHeroSubtitleInput] = useState(settings.heroSubtitle);
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // Add Product form state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Silk Thread Bangles');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newCategoryManagerInput, setNewCategoryManagerInput] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(699);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(999);
  const [newProdImage, setNewProdImage] = useState('/assets/images/bangles_silk_kundan_set_1794119599359.jpg');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMaterial, setNewProdMaterial] = useState('Mulberry Silk Thread, Brass Core, Kundan Work');
  const [newProdCraftingTime, setNewProdCraftingTime] = useState('2-3 Days Handcrafted');
  const [newProdSizes, setNewProdSizes] = useState<BangleSize[]>(['2.4', '2.6', '2.8']);
  const [newProdBestseller, setNewProdBestseller] = useState(false);

  // Edit Product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editOrigPrice, setEditOrigPrice] = useState(0);
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editSizes, setEditSizes] = useState<BangleSize[]>([]);
  const [editBestseller, setEditBestseller] = useState(false);
  const [editInStock, setEditInStock] = useState(true);
  const [isEditCustomCategory, setIsEditCustomCategory] = useState(false);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState('');

  // Order status update state
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<string | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<OrderStatus>('Crafting in Progress');
  const [courierInput, setCourierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [statusNoteInput, setStatusNoteInput] = useState('');

  // Handle QR code file upload
  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setQrCodeUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveQrSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      upiId: upiIdInput,
      upiPayeeName: payeeNameInput,
      qrCodeUrl: qrCodeUrlInput
    });
    setQrSaveSuccess(true);
    setTimeout(() => setQrSaveSuccess(false), 2500);
  };

  const saveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      brandName: brandNameInput,
      tagline: taglineInput,
      announcementText: announcementInput,
      freeShippingThreshold: Number(freeShippingThresholdInput),
      supportWhatsApp: whatsAppInput,
      heroHeadline: heroHeadlineInput,
      heroSubtitle: heroSubtitleInput
    });
    setSettingsSaveSuccess(true);
    setTimeout(() => setSettingsSaveSuccess(false), 2500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const chosenCategory = (isCustomCategory ? customCategoryInput.trim() : newProdCategory.trim()) || 'Silk Thread Bangles';
    if (chosenCategory) {
      addCategory(chosenCategory);
    }

    addProduct({
      name: newProdName,
      category: chosenCategory,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOrigPrice),
      image: newProdImage,
      description: newProdDesc || 'Fine handcrafted silk thread bangles woven by skilled artisans.',
      material: newProdMaterial,
      craftingTime: newProdCraftingTime,
      inStock: true,
      bestseller: newProdBestseller,
      sizes: newProdSizes,
    });

    setShowAddProductModal(false);
    // Reset form
    setNewProdName('');
    setNewProdDesc('');
    setIsCustomCategory(false);
    setCustomCategoryInput('');
  };

  const toggleSize = (sz: BangleSize) => {
    if (newProdSizes.includes(sz)) {
      if (newProdSizes.length > 1) {
        setNewProdSizes(newProdSizes.filter(s => s !== sz));
      }
    } else {
      setNewProdSizes([...newProdSizes, sz]);
    }
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditCategory(prod.category);
    setEditPrice(prod.price);
    setEditOrigPrice(prod.originalPrice || prod.price);
    setEditImage(prod.image);
    setEditDesc(prod.description);
    setEditSizes(prod.sizes || ['2.4', '2.6', '2.8']);
    setEditBestseller(!!prod.bestseller);
    setEditInStock(prod.inStock);
    setIsEditCustomCategory(!categories.includes(prod.category));
    setEditCustomCategoryInput(prod.category);
  };

  const toggleEditSize = (sz: BangleSize) => {
    if (editSizes.includes(sz)) {
      if (editSizes.length > 1) {
        setEditSizes(editSizes.filter(s => s !== sz));
      }
    } else {
      setEditSizes([...editSizes, sz]);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isEdit) {
          setEditImage(reader.result as string);
        } else {
          setNewProdImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const chosenCat = (isEditCustomCategory ? editCustomCategoryInput.trim() : editCategory.trim()) || editingProduct.category;
    if (chosenCat) {
      addCategory(chosenCat);
    }

    updateProduct(editingProduct.id, {
      name: editName,
      category: chosenCat,
      price: Number(editPrice),
      originalPrice: Number(editOrigPrice),
      image: editImage,
      description: editDesc,
      sizes: editSizes,
      bestseller: editBestseller,
      inStock: editInStock,
    });

    setEditingProduct(null);
  };

  const handleUpdateOrderStatus = (orderId: string) => {
    updateOrderStatus(orderId, newStatusValue, {
      courierPartner: courierInput || undefined,
      trackingNumber: trackingNumberInput || undefined,
      notes: statusNoteInput || undefined,
      location: 'Artisan Vijayawada Workshop'
    });
    setSelectedOrderForEdit(null);
  };

  if (!isAdminOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#f3dde3] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#f3dde3] bg-[#fdf7f9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#8c2a44] text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#3b121e]">
                Admin Management Console
              </h2>
              <p className="text-xs text-[#8c4e5f] font-light">
                Configure UPI QR Code payments, edit products, update real-time orders, and store settings
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#faedf1] text-[#6b2539] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#f3dde3] overflow-x-auto no-scrollbar bg-[#faf5f6] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr_payments')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'qr_payments'
                ? 'border-[#8c2a44] text-[#8c2a44] bg-white'
                : 'border-transparent text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code & UPI Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'border-[#8c2a44] text-[#8c2a44] bg-white'
                : 'border-transparent text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Customer Orders & Live Tracking ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'border-[#8c2a44] text-[#8c2a44] bg-white'
                : 'border-transparent text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store_settings')}
            className={`py-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'store_settings'
                ? 'border-[#8c2a44] text-[#8c2a44] bg-white'
                : 'border-transparent text-[#703b49] hover:text-[#3b121e]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Storefront Settings</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          
          {/* TAB 1: QR PAYMENTS MANAGEMENT */}
          {activeTab === 'qr_payments' && (
            <div className="space-y-6">
              
              <div className="bg-[#fcf0f3] p-4 rounded-2xl border border-[#f3dde3] text-xs text-[#521b2a]">
                <p className="font-semibold text-sm text-[#3b121e] mb-1">
                  💳 Admin Payment Configuration
                </p>
                <p>
                  Insert your custom UPI QR code image and UPI ID below. When customers checkout, they will scan this exact QR code from their mobile device to transfer payment directly to your account.
                </p>
              </div>

              {qrSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>QR Code & UPI payment credentials updated successfully!</span>
                </div>
              )}

              <form onSubmit={saveQrSettings} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#521b2a] mb-1">
                        Admin UPI ID (VPA) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. yourname@okaxis, yourbusiness@upi"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm font-mono text-[#3b121e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#521b2a] mb-1">
                        Merchant / Payee Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Handmade Thread Bangles Studio"
                        value={payeeNameInput}
                        onChange={(e) => setPayeeNameInput(e.target.value)}
                        className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#521b2a] mb-1">
                        QR Code Image URL or Upload File
                      </label>
                      <input
                        type="text"
                        placeholder="https://... or upload below"
                        value={qrCodeUrlInput}
                        onChange={(e) => setQrCodeUrlInput(e.target.value)}
                        className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] focus:border-[#8c2a44] focus:bg-white rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none mb-2"
                      />

                      <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-[#e8bac7] rounded-xl bg-[#faf5f6] hover:bg-[#faedf1] cursor-pointer transition-colors text-xs text-[#703b49]">
                        <Upload className="w-4 h-4 text-[#8c2a44]" />
                        <span>Upload Custom QR Code (JPG / PNG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setQrCodeUrlInput(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=${encodeURIComponent(upiIdInput)}%26pn=${encodeURIComponent(payeeNameInput)}%26cu=INR`);
                      }}
                      className="text-xs text-[#8c2a44] hover:underline font-medium"
                    >
                      ↺ Auto-generate fresh QR from current UPI ID
                    </button>
                  </div>

                  {/* Right Column: Live QR Preview */}
                  <div className="bg-[#faf5f6] p-5 rounded-2xl border border-[#f0cdd8] flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold text-[#3b121e] mb-3">
                      Live Customer Checkout QR Preview:
                    </p>
                    <div className="p-3 bg-white rounded-2xl border-2 border-[#d8899f] shadow-md inline-block">
                      <img
                        src={qrCodeUrlInput || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=ambitionbysha@axl'}
                        alt="Admin QR Code"
                        className="w-44 h-44 object-contain"
                      />
                    </div>
                    <p className="text-xs font-bold text-[#8c2a44] mt-2">{payeeNameInput}</p>
                    <p className="text-xs font-mono text-[#703b49]">{upiIdInput}</p>
                    <p className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-2 font-medium">
                      ✨ Auto-embeds exact order amount (e.g. ₹498) on customer scan
                    </p>
                  </div>

                </div>

                <div className="pt-4 border-t border-[#f3dde3] flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#8c2a44] hover:bg-[#721f35] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Save QR & Payment Settings
                  </button>
                </div>
              </form>

            </div>
          )}

          {/* TAB 2: ORDERS & REAL-TIME TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#3b121e]">
                    Customer Orders & Real-Time Tracking Dispatch
                  </h3>
                  <p className="text-xs text-[#8c4e5f] font-light">
                    Update order progress below. Customer tracking timelines will update instantaneously!
                  </p>
                </div>
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove all customer orders? This action cannot be undone.')) {
                        clearAllOrders();
                      }
                    }}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Orders</span>
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="p-10 text-center bg-[#faf5f6] rounded-2xl border border-dashed border-[#e8bac7] space-y-2">
                  <Package className="w-8 h-8 text-[#a06877] mx-auto stroke-1" />
                  <p className="text-sm font-semibold text-[#3b121e]">No Customer Orders Yet</p>
                  <p className="text-xs text-[#8c4e5f] font-light max-w-sm mx-auto">
                    When customers place orders via checkout, they will appear right here for tracking dispatch, status updates, and management.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id} 
                      className="bg-white rounded-2xl border border-[#f0cdd8] p-4 sm:p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f7e0e7] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#8c2a44]">#{ord.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-[#faedf1] text-[#8c2a44] border border-[#f0cdd8]'
                            }`}>
                              {ord.status}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              · {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-[#521b2a] mt-0.5 font-medium">
                            {ord.customerName} ({ord.phone} · {ord.email})
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrderForEdit(ord.id);
                              setNewStatusValue(ord.status);
                              setCourierInput(ord.courierPartner || 'Delhivery Express');
                              setTrackingNumberInput(ord.trackingNumber || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#faedf1] text-[#8c2a44] text-xs font-semibold hover:bg-[#f7dfe6] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update Live Tracking Status</span>
                          </button>

                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#e8bac7] text-[#521b2a] text-xs font-semibold hover:bg-[#faedf1] transition-colors flex items-center gap-1 cursor-pointer"
                            title="View / Download Order Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#8c2a44]" />
                            <span>Invoice</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete order #${ord.id}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold hover:bg-rose-100 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Delete this order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Modal or in-place edit row for Order Status */}
                      {selectedOrderForEdit === ord.id && (
                        <div className="bg-[#fcf0f3] p-4 rounded-xl border border-[#f0cdd8] space-y-3">
                          <p className="text-xs font-bold text-[#8c2a44]">
                            Update Tracking Status for #{ord.id}:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#521b2a] mb-1">
                                New Status Stage:
                              </label>
                              <select
                                value={newStatusValue}
                                onChange={(e) => setNewStatusValue(e.target.value as OrderStatus)}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#e8bac7] rounded-lg text-xs font-medium text-[#3b121e] outline-none"
                              >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Crafting in Progress">Crafting in Progress (Handmade)</option>
                                <option value="Quality Checked & Packed">Quality Checked & Packed</option>
                                <option value="Shipped / In Transit">Shipped / In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#521b2a] mb-1">
                                Courier Partner:
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Delhivery, Bluedart, DTDC"
                                value={courierInput}
                                onChange={(e) => setCourierInput(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#e8bac7] rounded-lg text-xs text-[#3b121e] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#521b2a] mb-1">
                                AWB Tracking Number:
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. DEL-9849204"
                                value={trackingNumberInput}
                                onChange={(e) => setTrackingNumberInput(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#e8bac7] rounded-lg text-xs font-mono text-[#3b121e] outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForEdit(null)}
                              className="px-3 py-1.5 rounded-lg border border-[#e8bac7] text-xs text-[#521b2a] hover:bg-white"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateOrderStatus(ord.id)}
                              className="px-4 py-1.5 rounded-lg bg-[#8c2a44] text-white text-xs font-semibold hover:bg-[#721f35]"
                            >
                              Save & Update Live
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Items & Shipping preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#521b2a]">
                        <div>
                          <p className="font-semibold text-[#3b121e]">Ordered Items:</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-[#703b49]">
                            {ord.items.map((it) => (
                              <li key={it.id}>
                                {it.product.name} — Size: <strong>{it.size}</strong> × {it.quantity} (₹{it.product.price * it.quantity})
                              </li>
                            ))}
                          </ul>
                          <p className="mt-1 font-bold text-[#8c2a44]">
                            Total: ₹{ord.totalAmount.toLocaleString('en-IN')} ({ord.paymentMethod})
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-[#3b121e]">Shipping Address:</p>
                          <p className="text-[#703b49] font-light">
                            {ord.shippingAddress.streetAddress}, {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                          </p>
                          {ord.utrNumber && (
                            <p className="text-[11px] font-mono text-emerald-800 font-semibold mt-1">
                              UPI UTR Ref: {ord.utrNumber} ({ord.paymentStatus})
                            </p>
                          )}
                          {ord.paymentScreenshotUrl && (
                            <div className="mt-1">
                              <a
                                href={ord.paymentScreenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-[#8c2a44] underline"
                              >
                                <Eye className="w-3 h-3" /> View Payment Screenshot
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              
              {/* Live Cloud Sync Status Banner */}
              {firestoreStatus === 'permission_denied' ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-[#523315] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <span>⚠️</span> Live Customer Mobile Sync Setup Required
                    </span>
                    <button
                      onClick={handleManualCloudSync}
                      disabled={syncingCloud}
                      className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium text-[11px] transition-colors"
                    >
                      {syncingCloud ? 'Checking...' : syncCloudSuccess ? '✓ Synced!' : '🔄 Retry Cloud Sync'}
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    To make products you add on this laptop appear live on customer mobile phones and other devices, your Firebase Firestore rules need read/write permissions.
                  </p>
                  <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="text-gray-700 select-all">allow read, write: if true;</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyFirestoreRule}
                        className="px-2 py-1 bg-[#8c2a44] text-white rounded font-sans font-semibold text-[10px] hover:bg-[#721f35]"
                      >
                        {copiedRule ? '✓ Rule Copied!' : '📋 Copy Rule'}
                      </button>
                      <a
                        href="https://console.firebase.google.com/project/bangles-236db/firestore/rules"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 rounded font-sans font-semibold text-[10px]"
                      >
                        Open Firebase Console ↗
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-semibold">Live Cross-Device Cloud Sync Active</span>
                    <span className="text-[11px] text-emerald-700 hidden sm:inline">— changes update customer phones in real-time</span>
                  </div>
                  <button
                    onClick={handleManualCloudSync}
                    disabled={syncingCloud}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold"
                  >
                    {syncingCloud ? 'Syncing...' : syncCloudSuccess ? '✓ Cloud Updated' : 'Push All to Cloud ↗'}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#3b121e]">
                    Store Product Catalog ({products.length})
                  </h3>
                  <p className="text-xs text-[#8c4e5f] font-light">
                    Add new handmade designs, change prices, or toggle in-stock status.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#8c2a44] text-white text-xs font-semibold hover:bg-[#721f35] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Custom Category Management Bar */}
              <div className="bg-[#fcf0f3] border border-[#f0cdd8] rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-[#3b121e]">Manage Your Store Categories ({categories.length})</h4>
                    <p className="text-[11px] text-[#8c4e5f]">Add your custom categories or delete the ones you don&apos;t want.</p>
                  </div>
                  
                  {/* Quick add category input */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Add new category..."
                      value={newCategoryManagerInput}
                      onChange={(e) => setNewCategoryManagerInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newCategoryManagerInput.trim()) {
                            addCategory(newCategoryManagerInput.trim());
                            setNewCategoryManagerInput('');
                          }
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none text-[#3b121e] min-w-[170px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryManagerInput.trim()) {
                          addCategory(newCategoryManagerInput.trim());
                          setNewCategoryManagerInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#8c2a44] text-white text-xs font-semibold rounded-lg hover:bg-[#721f35] transition-colors cursor-pointer shrink-0"
                    >
                      + Add Category
                    </button>
                  </div>
                </div>

                {/* Category chips list with remove button */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#e8bac7] text-[#551d2e] shadow-2xs group"
                    >
                      <span>{cat}</span>
                      {cat !== 'All Bangles' && (
                        <button
                          type="button"
                          onClick={() => deleteCategory(cat)}
                          className="text-gray-400 hover:text-rose-600 font-bold ml-1 text-sm leading-none p-0.5 cursor-pointer"
                          title={`Delete "${cat}" category`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Grid Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-white border border-[#f0cdd8] rounded-xl p-3 flex gap-3 items-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#3b121e] truncate">{prod.name}</h4>
                      <p className="text-[10px] text-[#8c4e5f] truncate">{prod.category}</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#8c2a44]">₹{prod.price}</span>
                        {prod.originalPrice && <span className="text-[10px] text-gray-400 line-through">₹{prod.originalPrice}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={() => updateProduct(prod.id, { inStock: !prod.inStock })}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium cursor-pointer transition-colors ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1 rounded hover:bg-[#faedf1] text-gray-500 hover:text-[#8c2a44] transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Product Modal */}
              {showAddProductModal && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#f0cdd8] space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif-luxury text-lg font-bold text-[#3b121e]">Add New Handcrafted Bangle Design</h4>
                      <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-black">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Ruby Silk Thread Kada"
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#e8bac7] rounded-lg outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-[#521b2a]">Category</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCategory(!isCustomCategory);
                                if (!isCustomCategory) {
                                  setCustomCategoryInput('');
                                }
                              }}
                              className="text-[10px] text-[#8c2a44] hover:underline font-bold cursor-pointer"
                            >
                              {isCustomCategory ? "← Choose existing" : "+ Type custom"}
                            </button>
                          </div>

                          {isCustomCategory ? (
                            <input
                              type="text"
                              required
                              autoFocus
                              placeholder="Type category (e.g. Earrings, Hair Clips...)"
                              value={customCategoryInput}
                              onChange={(e) => {
                                setCustomCategoryInput(e.target.value);
                                setNewProdCategory(e.target.value);
                              }}
                              className="w-full px-2.5 py-1.5 border-2 border-[#8c2a44] rounded-lg outline-none bg-white text-xs font-medium text-[#3b121e]"
                            />
                          ) : (
                            <select
                              value={newProdCategory}
                              onChange={(e) => {
                                if (e.target.value === '__NEW_CUSTOM__') {
                                  setIsCustomCategory(true);
                                  setCustomCategoryInput('');
                                } else {
                                  setNewProdCategory(e.target.value);
                                }
                              }}
                              className="w-full px-2 py-1.5 border border-[#e8bac7] rounded-lg outline-none bg-white text-xs"
                            >
                              {categories.filter(c => c !== 'All Bangles').map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                              <option value="__NEW_CUSTOM__">+ Type Custom Category...</option>
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block font-semibold text-[#521b2a] mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-[#e8bac7] rounded-lg outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Image URL or Upload</label>
                        <input
                          type="text"
                          required
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#e8bac7] rounded-lg outline-none mb-1.5"
                        />
                        <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-[#e8bac7] rounded-lg bg-[#faf5f6] hover:bg-[#faedf1] cursor-pointer text-[11px] text-[#703b49] transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#8c2a44]" />
                          <span>Upload photo from device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProductImageUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Available Sizes</label>
                        <div className="flex gap-1.5">
                          {(['2.2', '2.4', '2.6', '2.8', '2.10', 'Custom Bridal'] as BangleSize[]).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleSize(sz)}
                              className={`px-2 py-1 rounded text-[11px] font-medium border ${
                                newProdSizes.includes(sz) ? 'bg-[#8c2a44] text-white border-[#8c2a44]' : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newProdDesc}
                          onChange={(e) => setNewProdDesc(e.target.value)}
                          placeholder="Intricate silk thread work..."
                          className="w-full px-3 py-1.5 border border-[#e8bac7] rounded-lg outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="bestseller-check"
                          checked={newProdBestseller}
                          onChange={(e) => setNewProdBestseller(e.target.checked)}
                          className="rounded text-[#8c2a44]"
                        />
                        <label htmlFor="bestseller-check" className="text-xs text-[#521b2a]">
                          Feature as Bestseller on Homepage
                        </label>
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-[#f0cdd8]">
                        <button
                          type="button"
                          onClick={() => setShowAddProductModal(false)}
                          className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 rounded-lg bg-[#8c2a44] text-white font-semibold"
                        >
                          Add Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Product Modal */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#f0cdd8] space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center border-b border-[#f3dde3] pb-3">
                      <div>
                        <h4 className="font-serif-luxury text-lg font-bold text-[#3b121e]">Edit Product</h4>
                        <p className="text-[11px] text-[#8c4e5f]">Update details, category, pricing, sizes, or photo</p>
                      </div>
                      <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black p-1 cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProductEdit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Product Title</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-[#521b2a]">Category</label>
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditCustomCategory(!isEditCustomCategory);
                                if (!isEditCustomCategory) setEditCustomCategoryInput('');
                              }}
                              className="text-[10px] text-[#8c2a44] hover:underline font-bold cursor-pointer"
                            >
                              {isEditCustomCategory ? "← Existing" : "+ Custom"}
                            </button>
                          </div>

                          {isEditCustomCategory ? (
                            <input
                              type="text"
                              required
                              placeholder="Type category..."
                              value={editCustomCategoryInput}
                              onChange={(e) => {
                                setEditCustomCategoryInput(e.target.value);
                                setEditCategory(e.target.value);
                              }}
                              className="w-full px-2.5 py-1.5 border-2 border-[#8c2a44] rounded-lg outline-none bg-white text-xs font-medium text-[#3b121e]"
                            />
                          ) : (
                            <select
                              value={editCategory}
                              onChange={(e) => {
                                if (e.target.value === '__NEW_CUSTOM__') {
                                  setIsEditCustomCategory(true);
                                  setEditCustomCategoryInput('');
                                } else {
                                  setEditCategory(e.target.value);
                                }
                              }}
                              className="w-full px-2 py-1.5 border border-[#e8bac7] rounded-lg outline-none bg-white text-xs"
                            >
                              {categories.filter(c => c !== 'All Bangles').map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                              <option value="__NEW_CUSTOM__">+ Type Custom...</option>
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block font-semibold text-[#521b2a] mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-[#521b2a] mb-1">Original / MRP Price (₹)</label>
                          <input
                            type="number"
                            value={editOrigPrice}
                            onChange={(e) => setEditOrigPrice(Number(e.target.value))}
                            className="w-full px-3 py-1.5 border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#521b2a] mb-1">Stock Status</label>
                          <select
                            value={editInStock ? 'true' : 'false'}
                            onChange={(e) => setEditInStock(e.target.value === 'true')}
                            className="w-full px-2 py-1.5 border border-[#e8bac7] rounded-lg outline-none bg-white text-xs"
                          >
                            <option value="true">In Stock</option>
                            <option value="false">Out of Stock</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Product Photo URL or Upload</label>
                        <input
                          type="text"
                          required
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none mb-1.5"
                        />
                        <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-[#e8bac7] rounded-lg bg-[#faf5f6] hover:bg-[#faedf1] cursor-pointer text-[11px] text-[#703b49] transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[#8c2a44]" />
                          <span>Upload new photo from device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProductImageUpload(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Available Sizes</label>
                        <div className="flex flex-wrap gap-1.5">
                          {(['2.2', '2.4', '2.6', '2.8', '2.10', 'Custom Bridal'] as BangleSize[]).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleEditSize(sz)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium border cursor-pointer transition-all ${
                                editSizes.includes(sz) ? 'bg-[#8c2a44] text-white border-[#8c2a44]' : 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#521b2a] mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-3 py-1.5 border border-[#e8bac7] focus:border-[#8c2a44] rounded-lg outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="edit-bestseller-check"
                          checked={editBestseller}
                          onChange={(e) => setEditBestseller(e.target.checked)}
                          className="rounded text-[#8c2a44]"
                        />
                        <label htmlFor="edit-bestseller-check" className="text-xs text-[#521b2a]">
                          Feature as Bestseller on Homepage
                        </label>
                      </div>

                      <div className="pt-3 flex justify-end gap-2 border-t border-[#f0cdd8]">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-1.5 rounded-lg bg-[#8c2a44] text-white font-semibold hover:bg-[#721f35] transition-colors cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: STORE SETTINGS */}
          {activeTab === 'store_settings' && (
            <form onSubmit={saveGeneralSettings} className="space-y-4 text-xs">
              
              <div className="bg-[#fcf0f3] p-4 rounded-2xl border border-[#f3dde3] text-xs text-[#521b2a]">
                <p className="font-semibold text-sm text-[#3b121e] mb-1">
                  ✨ Storefront Brand & Messaging
                </p>
                <p>
                  Customize your brand title, top announcement banner, and free shipping conditions.
                </p>
              </div>

              {settingsSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Store settings updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#521b2a] mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandNameInput}
                    onChange={(e) => setBrandNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#521b2a] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#521b2a] mb-1">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#521b2a] mb-1">Free Shipping Threshold (₹)</label>
                  <input
                    type="number"
                    value={freeShippingThresholdInput}
                    onChange={(e) => setFreeShippingThresholdInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#521b2a] mb-1">Support WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsAppInput}
                    onChange={(e) => setWhatsAppInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#521b2a] mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={heroHeadlineInput}
                    onChange={(e) => setHeroHeadlineInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#521b2a] mb-1">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={heroSubtitleInput}
                    onChange={(e) => setHeroSubtitleInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf5f6] border border-[#e8bac7] rounded-xl text-xs sm:text-sm text-[#3b121e] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#f3dde3] flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#8c2a44] text-white font-semibold hover:bg-[#721f35] transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
