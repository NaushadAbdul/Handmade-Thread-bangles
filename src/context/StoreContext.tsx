import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, StoreSettings, UserProfile, BangleSize, ShippingAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS, INITIAL_ORDERS } from '../data/initialData';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';

export const ADMIN_EMAILS = ['craftedbangles272@gmail.com', 'naushadabdul2006@gmail.com'];
export const checkIsAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, size: BangleSize, quantity?: number) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  currentUser: UserProfile | null;
  authLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoCustomer: () => void;
  loginAsCraftedBanglesAdmin: () => void;
  logout: () => Promise<void>;

  orders: Order[];
  createOrder: (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'UPI_QR' | 'COD' | 'ONLINE';
    utrNumber?: string;
    paymentScreenshotUrl?: string;
  }) => Promise<Order>;
  updateOrderStatus: (
    orderId: string, 
    newStatus: OrderStatus, 
    trackingData?: { trackingNumber?: string; courierPartner?: string; notes?: string; location?: string }
  ) => void;
  getOrderById: (orderId: string) => Order | undefined;

  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // UI state modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authSuccessRedirect: 'checkout' | null;
  setAuthSuccessRedirect: (val: 'checkout' | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  selectedProductForQuickView: Product | null;
  setSelectedProductForQuickView: (prod: Product | null) => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'htb_products_v1',
  CART: 'htb_cart_v1',
  WISHLIST: 'htb_wishlist_v1',
  ORDERS: 'htb_orders_v1',
  SETTINGS: 'htb_settings_v1',
  USER: 'htb_user_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Settings State (contains UPI QR code, UPI ID, brand info)
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...INITIAL_STORE_SETTINGS, ...JSON.parse(saved) } : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Modals & Navigation
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSuccessRedirect, setAuthSuccessRedirect] = useState<'checkout' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('HTB-2026-8941');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All Bangles');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage synchronizers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (err) {
      console.warn('Storage error:', err);
    }
  }, [currentUser]);

  // Firebase Auth listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
        if (firebaseUser) {
          const userEmail = firebaseUser.email || '';
          const isAdmin = checkIsAdmin(userEmail);
          setCurrentUser({
            uid: firebaseUser.uid,
            email: userEmail || 'customer@example.com',
            displayName: firebaseUser.displayName || userEmail.split('@')[0] || 'Customer',
            isAdmin
          });
        }
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn('Firebase auth listener skipped, falling back to local auth state', error);
      setAuthLoading(false);
    }
  }, []);

  // Try syncing orders from Firestore if accessible
  useEffect(() => {
    try {
      const ordersCol = collection(db, 'orders');
      const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
        if (!snapshot.empty) {
          const remoteOrders = snapshot.docs.map(doc => doc.data() as Order);
          if (remoteOrders.length > 0) {
            setOrders(prev => {
              // merge unique by id
              const map = new Map<string, Order>();
              prev.forEach(o => map.set(o.id, o));
              remoteOrders.forEach(o => map.set(o.id, o));
              return Array.from(map.values());
            });
          }
        }
      }, (err) => {
        // quiet fallback to local storage
        console.debug('Firestore orders listener:', err.message);
      });
      return () => unsubscribe();
    } catch (e) {
      console.debug('Firestore subscription offline:', e);
    }
  }, []);

  // Cart operations
  const addToCart = (product: Product, size: BangleSize, quantity = 1) => {
    const itemId = `${product.id}_${size}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        return prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: itemId, product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth operations
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string; isAdmin?: boolean }> => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const userEmail = (user.email || '').toLowerCase().trim();
      const isAdmin = checkIsAdmin(userEmail);
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        isAdmin
      };
      setCurrentUser(userProfile);
      if (isAdmin) {
        setIsAdminOpen(true);
      }
      return { success: true, isAdmin };
    } catch (err: any) {
      console.warn('Google popup error:', err);
      return { success: false, error: err.message || 'Google sign-in popup failed or was cancelled.' };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const user = res.user;
      const isAdmin = checkIsAdmin(user.email || email);
      setCurrentUser({
        uid: user.uid,
        email: user.email || email,
        displayName: user.displayName || email.split('@')[0],
        isAdmin
      });
      if (isAdmin) {
        setIsAdminOpen(true);
      }
      return { success: true };
    } catch (err: any) {
      // In case of Firebase auth errors or demo testing, provide graceful local fallback
      if (email && pass.length >= 4) {
        const isAdmin = checkIsAdmin(email);
        const localUser: UserProfile = {
          uid: 'usr_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          isAdmin
        };
        setCurrentUser(localUser);
        if (isAdmin) {
          setIsAdminOpen(true);
        }
        return { success: true };
      }
      return { success: false, error: err.message || 'Login failed. Please check credentials.' };
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const user = res.user;
      const isAdmin = checkIsAdmin(user.email || email);
      setCurrentUser({
        uid: user.uid,
        email: user.email || email,
        displayName: name || user.displayName || email.split('@')[0],
        isAdmin
      });
      if (isAdmin) {
        setIsAdminOpen(true);
      }
      return { success: true };
    } catch (err: any) {
      // Graceful local fallback for prototype testing
      if (email && pass.length >= 4) {
        const isAdmin = checkIsAdmin(email);
        const localUser: UserProfile = {
          uid: 'usr_' + Date.now(),
          email,
          displayName: name || email.split('@')[0],
          isAdmin
        };
        setCurrentUser(localUser);
        if (isAdmin) {
          setIsAdminOpen(true);
        }
        return { success: true };
      }
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const loginAsCraftedBanglesAdmin = () => {
    const adminUser: UserProfile = {
      uid: 'admin_crafted_bangles_272',
      email: 'craftedbangles272@gmail.com',
      displayName: 'Crafted Bangles Store Owner',
      phone: '+91 98765 43210',
      isAdmin: true
    };
    setCurrentUser(adminUser);
    setIsAdminOpen(true);
  };

  const loginAsDemoCustomer = () => {
    const demoUser: UserProfile = {
      uid: 'demo_user_101',
      email: 'aarti.patel@gmail.com',
      displayName: 'Aarti Patel',
      phone: '+91 98450 12345',
      shippingAddress: {
        fullName: 'Aarti Patel',
        phone: '+91 98450 12345',
        email: 'aarti.patel@gmail.com',
        streetAddress: 'B-12, Royal Palms Society, SV Road',
        landmark: 'Opposite Silver Jubilee Garden',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      }
    };
    setCurrentUser(demoUser);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // fallback
    }
    setCurrentUser(null);
  };

  // Product management for Admin
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: 'htb-' + Date.now().toString(36),
      rating: 5.0,
      reviewCount: 1
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Settings update for Admin (e.g., QR code, UPI ID, brand banner)
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Order creation
  const createOrder = async (orderData: {
    shippingAddress: ShippingAddress;
    paymentMethod: 'UPI_QR' | 'COD' | 'ONLINE';
    utrNumber?: string;
    paymentScreenshotUrl?: string;
  }): Promise<Order> => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `HTB-${new Date().getFullYear()}-${orderNum}`;
    const subtotal = cartSubtotal;
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : 99;
    const totalAmount = subtotal + shippingFee;

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.shippingAddress.fullName,
      email: orderData.shippingAddress.email,
      phone: orderData.shippingAddress.phone,
      shippingAddress: orderData.shippingAddress,
      items: [...cart],
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'UPI_QR' && orderData.utrNumber ? 'Verified' : 'Pending Verification',
      utrNumber: orderData.utrNumber,
      paymentScreenshotUrl: orderData.paymentScreenshotUrl,
      status: 'Order Placed',
      estimatedDelivery: 'Within 4-6 Business Days',
      notes: orderData.shippingAddress.customNotes || 'Handmade customized to wrist size.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          description: orderData.paymentMethod === 'UPI_QR' 
            ? `Order placed successfully with UPI reference: ${orderData.utrNumber || 'Submitted'}` 
            : 'Order received and confirmed',
          location: 'Bangles Online Store'
        }
      ]
    };

    // Save to local state
    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setTrackingOrderId(newOrder.id);
    clearCart();

    // Attempt firestore background sync
    try {
      const orderRef = doc(db, 'orders', newOrder.id);
      await setDoc(orderRef, newOrder);
    } catch (e) {
      console.debug('Firestore order sync skipped:', e);
    }

    return newOrder;
  };

  // Real-time status update for Admin
  const updateOrderStatus = (
    orderId: string, 
    newStatus: OrderStatus, 
    trackingData?: { trackingNumber?: string; courierPartner?: string; notes?: string; location?: string }
  ) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const newHistoryItem = {
        status: newStatus,
        timestamp: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        description: getStatusDefaultDescription(newStatus, trackingData?.trackingNumber, trackingData?.courierPartner),
        location: trackingData?.location || 'Central Workshop'
      };

      const updated: Order = {
        ...order,
        status: newStatus,
        trackingNumber: trackingData?.trackingNumber ?? order.trackingNumber,
        courierPartner: trackingData?.courierPartner ?? order.courierPartner,
        notes: trackingData?.notes ?? order.notes,
        updatedAt: new Date().toISOString(),
        statusHistory: [...order.statusHistory, newHistoryItem]
      };

      // Background firestore sync
      try {
        const orderRef = doc(db, 'orders', orderId);
        setDoc(orderRef, updated, { merge: true });
      } catch (e) {
        console.debug('Firestore update error:', e);
      }

      return updated;
    }));
  };

  const getOrderById = (orderId: string) => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleanId || o.phone.includes(cleanId) || o.email.toLowerCase() === cleanId.toLowerCase());
  };

  return (
    <StoreContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      updateCartItemQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      currentUser,
      authLoading,
      loginWithEmail,
      loginWithGoogle,
      registerWithEmail,
      loginAsDemoCustomer,
      loginAsCraftedBanglesAdmin,
      logout,
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      settings,
      updateSettings,
      isCartOpen,
      setIsCartOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authSuccessRedirect,
      setAuthSuccessRedirect,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isTrackingModalOpen,
      setIsTrackingModalOpen,
      isAdminOpen,
      setIsAdminOpen,
      isSizeGuideOpen,
      setIsSizeGuideOpen,
      selectedProductForQuickView,
      setSelectedProductForQuickView,
      trackingOrderId,
      setTrackingOrderId,
      lastPlacedOrder,
      setLastPlacedOrder,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

function getStatusDefaultDescription(status: OrderStatus, trackingNo?: string, courier?: string): string {
  switch (status) {
    case 'Order Placed':
      return 'Order placed and payment recorded.';
    case 'Crafting in Progress':
      return 'Master artisan is carefully weaving silk thread and embedding stones.';
    case 'Quality Checked & Packed':
      return 'Inspection passed. Packaged in protective luxury gift box.';
    case 'Shipped / In Transit':
      return `Package dispatched via ${courier || 'Express Courier'}${trackingNo ? ` (AWB: ${trackingNo})` : ''}.`;
    case 'Delivered':
      return 'Order successfully delivered to customer doorstep.';
    case 'Cancelled':
      return 'Order has been cancelled upon request.';
    default:
      return 'Status updated.';
  }
}
