import { Product, StoreSettings, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-earrings-01',
    name: 'Earrings',
    category: 'Earrings',
    price: 299,
    originalPrice: 999,
    image: '/assets/images/earrings_product.jpg',
    description: 'Earrings For You!',
    inStock: true,
    bestseller: true,
    featured: true,
    sizes: ['2.4', '2.6', '2.8'],
    material: 'Pure Handcrafted Silk & Gold Filigree',
    craftingTime: '2 Days Handcrafting',
    rating: 5.0,
    reviewCount: 1,
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  brandName: 'Ambitionbysha',
  tagline: 'Handcrafted with Love & Elegance ♡',
  announcementText: '✨ Free Shipping on Orders Above ₹999 | New Arrivals Every Week | Handcrafted with Love ✨',
  freeShippingThreshold: 999,
  supportWhatsApp: '+91 73964 53236',
  supportEmail: 'craftedbangles272@gmail.com',
  upiId: 'ambitionbysha@axl',
  upiPayeeName: 'Ambition by Sha',
  // Default clean generated SVG QR code representation so UPI scanning works out-of-the-box
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=ambitionbysha@axl%26pn=Ambition%20by%20Sha%26cu=INR',
  heroHeadline: 'Accessories that Reflect You ♡',
  heroSubtitle: 'Handcrafted silk thread bangles, bridal kundan choodas, and custom festive sets woven with precision and passion.',
  instagramUrl: 'https://www.instagram.com/ambitionbysha?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw=='
};

export const INITIAL_ORDERS: Order[] = [];

export const CATEGORIES = [
  'All Bangles',
  'Earrings',
  'Silk Thread Bangles',
  'Kundan Bridal Chooda',
  'Zari Velvet Bangles',
  'Pearl Kada & Latkan',
  'Baby & Kids Bangles',
  'Festive Sets',
  'Gift Hampers'
];
