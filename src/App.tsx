import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroVideo } from './components/HeroVideo';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanel } from './components/AdminPanel';
import { InvoiceModal } from './components/InvoiceModal';
import { BangleSizeGuideModal } from './components/BangleSizeGuideModal';
import { GiftSection } from './components/GiftSection';
import { ValueProps } from './components/ValueProps';
import { InstagramGallery } from './components/InstagramGallery';
import { Footer } from './components/Footer';
import { ShoppingBag, Truck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedProductForQuickView,
    setSelectedProductForQuickView,
    isSizeGuideOpen,
    setIsSizeGuideOpen,
    cartCount,
    setIsCartOpen,
    setIsTrackingModalOpen,
    wishlist
  } = useStore();

  // Filter products by category, search query
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'All Bangles' || prod.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || (
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#faf5f6] text-[#2b1f24] flex flex-col font-sans-brand">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section with Video */}
        <HeroVideo />

        {/* Product Catalog Section */}
        <section id="catalog-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <span className="text-base text-[#b44865]">♡</span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#3b121e] tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory === 'All Bangles' ? 'Bestsellers ♡' : selectedCategory}
              </h2>
              <span className="text-base text-[#b44865]">♡</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8c4e5f] font-light max-w-lg mx-auto">
              {searchQuery 
                ? `Showing handcrafted designs matching your search` 
                : 'Each piece is individually wound with pure silk thread, embellished with Kundan, and sized to perfection.'}
            </p>
          </div>

          {/* Active Search / Filters summary */}
          {(searchQuery || selectedCategory !== 'All Bangles') && (
            <div className="mb-6 flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-[#f0cdd8] text-xs">
              <span className="text-[#551d2e]">
                {searchQuery 
                  ? <>Found <strong>{filteredProducts.length}</strong> bangles matching &apos;{searchQuery}&apos;</>
                  : <>Showing <strong>{selectedCategory}</strong> ({filteredProducts.length})</>
                }
              </span>
              <button
                onClick={() => { setSelectedCategory('All Bangles'); setSearchQuery(''); }}
                className="text-[#8c2a44] hover:underline font-semibold cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#f0cdd8] p-8 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#faedf1] text-[#8c2a44] flex items-center justify-center mx-auto text-2xl">
                🧵
              </div>
              <h3 className="font-serif-luxury text-xl text-[#3b121e]">No bangles found</h3>
              <p className="text-xs text-[#8c4e5f] font-light">
                Try selecting a different category or clearing your search term.
              </p>
              <button
                onClick={() => { setSelectedCategory('All Bangles'); setSearchQuery(''); }}
                className="px-5 py-2 rounded-full bg-[#8c2a44] text-white text-xs font-semibold hover:bg-[#721f35] transition-colors"
              >
                View All Bangles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </section>

        {/* Gift Section */}
        <GiftSection />

        {/* Value Propositions / Trust Strip */}
        <ValueProps />

        {/* Customer Instagram Styling Gallery */}
        <InstagramGallery />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Controls for Mobile / Quick Access */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2.5">
        {/* Track Order Floating Button */}
        <button
          onClick={() => setIsTrackingModalOpen(true)}
          className="px-3.5 py-2.5 rounded-full bg-white/95 text-[#8c2a44] border border-[#f0cdd8] shadow-lg hover:shadow-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
          title="Track Live Order Status"
        >
          <Truck className="w-4 h-4 text-[#8c2a44]" />
          <span className="hidden sm:inline">Track Order</span>
        </button>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-3.5 rounded-full bg-[#8c2a44] text-white shadow-xl hover:bg-[#721f35] transition-transform active:scale-95 relative cursor-pointer"
          title="Open Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#e0567b] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Modals & Overlays */}
      <ProductModal
        product={selectedProductForQuickView}
        onClose={() => setSelectedProductForQuickView(null)}
      />
      <CartDrawer />
      <AuthModal />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminPanel />
      <InvoiceModal />
      <BangleSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
