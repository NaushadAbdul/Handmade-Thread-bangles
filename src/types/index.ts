export type BangleSize = '2.2' | '2.4' | '2.6' | '2.8' | '2.10' | 'Custom Bridal';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  secondaryImage?: string;
  description: string;
  inStock: boolean;
  bestseller?: boolean;
  featured?: boolean;
  sizes: BangleSize[];
  material?: string;
  craftingTime?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string; // unique combo of product id and size
  product: Product;
  size: BangleSize;
  quantity: number;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Crafting in Progress'
  | 'Quality Checked & Packed'
  | 'Shipped / In Transit'
  | 'Delivered'
  | 'Cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  customNotes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'UPI_QR' | 'COD' | 'ONLINE';
  paymentStatus: 'Pending Verification' | 'Verified' | 'Failed';
  utrNumber?: string;
  paymentScreenshotUrl?: string;
  status: OrderStatus;
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  shippingAddress?: Partial<ShippingAddress>;
  isAdmin?: boolean;
}

export interface StoreSettings {
  brandName: string;
  tagline: string;
  announcementText: string;
  freeShippingThreshold: number;
  supportWhatsApp: string;
  supportEmail: string;
  upiId: string;
  upiPayeeName: string;
  qrCodeUrl: string;
  heroHeadline: string;
  heroSubtitle: string;
  instagramUrl?: string;
}
