import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  Truck, 
  ShieldCheck, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { 
    settings, 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    currentUser, 
    setIsAuthModalOpen, 
    setIsTrackingModalOpen,
    setIsAdminOpen,
    logout,
    searchQuery,
    setSearchQuery,
    setSelectedCategory
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (categoryName?: string) => {
    if (categoryName) {
      setSelectedCategory(categoryName);
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fdf8f9]/95 backdrop-blur-md border-b border-[#f3dde3] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#f0bccb] text-[#551d2e] py-1.5 px-4 text-center text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
        <span>{settings.announcementText}</span>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#68303f] hover:text-[#38111d] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex-1 md:flex-none text-center md:text-left">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-block group"
            >
              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-normal tracking-tight text-[#421724] group-hover:text-[#b44865] transition-colors">
                {settings.brandName}
              </h1>
              <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[#9e5e71] -mt-1 font-light">
                — {settings.tagline} —
              </p>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6b3544]">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#b44865] transition-colors py-1"
            >
              Home
            </a>
            
            {/* Shop Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => handleNavClick('All Bangles')}
                className="flex items-center gap-1 hover:text-[#b44865] transition-colors py-1 cursor-pointer"
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-0 hidden group-hover:block w-56 pt-2 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-[#f3dde3] p-2 py-3 flex flex-col gap-1 text-xs">
                  <button 
                    onClick={() => handleNavClick('Silk Thread Bangles')}
                    className="text-left px-3 py-2 rounded-lg text-[#551d2e] hover:bg-[#fcf0f3] transition-colors"
                  >
                    🧵 Silk Thread Bangles
                  </button>
                  <button 
                    onClick={() => handleNavClick('Kundan Bridal Chooda')}
                    className="text-left px-3 py-2 rounded-lg text-[#551d2e] hover:bg-[#fcf0f3] transition-colors"
                  >
                    👑 Kundan Bridal Chooda
                  </button>
                  <button 
                    onClick={() => handleNavClick('Zari Velvet Bangles')}
                    className="text-left px-3 py-2 rounded-lg text-[#551d2e] hover:bg-[#fcf0f3] transition-colors"
                  >
                    ✨ Zari Velvet Bangles
                  </button>
                  <button 
                    onClick={() => handleNavClick('Pearl Kada & Latkan')}
                    className="text-left px-3 py-2 rounded-lg text-[#551d2e] hover:bg-[#fcf0f3] transition-colors"
                  >
                    🪡 Pearl Kada & Latkan
                  </button>
                  <button 
                    onClick={() => handleNavClick('Gift Hampers')}
                    className="text-left px-3 py-2 rounded-lg text-[#551d2e] hover:bg-[#fcf0f3] transition-colors"
                  >
                    🎁 Bridal Gift Hampers
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('Silk Thread Bangles')} 
              className="hover:text-[#b44865] transition-colors py-1 cursor-pointer"
            >
              Collections
            </button>
            
            <button 
              onClick={() => setIsTrackingModalOpen(true)}
              className="flex items-center gap-1.5 text-[#a83253] hover:text-[#7f1c37] font-semibold transition-colors py-1 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order</span>
            </button>

            <a 
              href="#about" 
              className="hover:text-[#b44865] transition-colors py-1"
            >
              About
            </a>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Toggle / Input */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-white border border-[#e8bac7] rounded-full px-3 py-1 shadow-sm">
                  <Search className="w-4 h-4 text-[#8a4255] mr-2" />
                  <input
                    type="text"
                    placeholder="Search silk bangles, kundan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="text-xs sm:text-sm text-[#421724] bg-transparent outline-none w-32 sm:w-48 placeholder-[#bda3ab]"
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                    className="text-[#9e5e71] hover:text-[#421724] text-xs font-semibold p-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowSearchInput(true)} 
                  className="p-2 text-[#68303f] hover:text-[#b44865] hover:bg-[#faeaf0] rounded-full transition-colors"
                  title="Search bangles"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Customer User Account */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-[#fcecf1] hover:bg-[#f7dbe4] text-[#6b2539] text-xs font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{currentUser.displayName || 'Account'}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#f3dde3] py-2 z-50">
                      <div className="px-3 py-2 border-b border-[#fbf0f2]">
                        <p className="text-xs font-semibold text-[#421724] truncate">{currentUser.displayName || 'Customer'}</p>
                        <p className="text-[11px] text-[#9e5e71] truncate">{currentUser.email}</p>
                      </div>
                      {/* Admin Dashboard link visible only to craftedbangles272@gmail.com / admin */}
                      {currentUser.isAdmin && (
                        <div className="px-2 py-1">
                          <button
                            onClick={() => { setIsAdminOpen(true); setUserDropdownOpen(false); }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-[#8c2a44] bg-[#fce7ed] hover:bg-[#fad0dd] rounded-lg flex items-center gap-2 border border-[#f5b8c9] transition-colors"
                          >
                            <Settings className="w-3.5 h-3.5 text-[#8c2a44]" />
                            <span>Admin Dashboard</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => { setIsTrackingModalOpen(true); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-[#551d2e] hover:bg-[#fcf0f3] flex items-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#b44865]" />
                        <span>My Orders & Tracking</span>
                      </button>
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 text-[#68303f] hover:text-[#b44865] hover:bg-[#faeaf0] rounded-full transition-colors"
                  title="Sign in or register"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button 
              onClick={() => {
                if (wishlist.length > 0) {
                  setSelectedCategory('All Bangles');
                  const catalogEl = document.getElementById('catalog-section');
                  catalogEl?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-2 text-[#68303f] hover:text-[#b44865] hover:bg-[#faeaf0] rounded-full transition-colors relative"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#d84d72] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Shopping Bag */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 bg-[#6b2539] hover:bg-[#521929] text-white rounded-full transition-colors relative shadow-sm"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e0567b] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#f3dde3] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#551d2e]">
            <button 
              onClick={() => handleNavClick('All Bangles')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#fcf0f3]"
            >
              🛍️ All Handcrafted Bangles
            </button>
            <button 
              onClick={() => handleNavClick('Silk Thread Bangles')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#fcf0f3]"
            >
              🧵 Silk Thread Bangles
            </button>
            <button 
              onClick={() => handleNavClick('Kundan Bridal Chooda')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#fcf0f3]"
            >
              👑 Kundan Bridal Chooda
            </button>
            <button 
              onClick={() => handleNavClick('Gift Hampers')}
              className="text-left py-2 px-3 rounded-lg hover:bg-[#fcf0f3]"
            >
              🎁 Bridal Gift Boxes
            </button>
            <button 
              onClick={() => { setIsTrackingModalOpen(true); setMobileMenuOpen(false); }}
              className="text-left py-2 px-3 rounded-lg bg-[#fcecf1] text-[#9b2a4a] font-semibold flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track My Order Real-Time</span>
            </button>
            {currentUser?.isAdmin && (
              <button 
                onClick={() => { setIsAdminOpen(true); setMobileMenuOpen(false); }}
                className="text-left py-2 px-3 rounded-lg border border-[#f5b8c9] bg-[#fce7ed] text-[#7d203a] font-semibold flex items-center gap-2"
              >
                <Settings className="w-4 h-4 text-[#8c2a44]" />
                <span>Admin Store Management</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
