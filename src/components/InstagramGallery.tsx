import React from 'react';
import { Instagram, Heart } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const PHOTOS = [
    {
      img: '/assets/images/bangles_silk_kundan_set_1794119599359.jpg',
      tag: '@aarti_weddings',
      caption: 'My bridal silk thread kundan bangles turned out even more breathtaking in person! ♡'
    },
    {
      img: '/assets/images/bangles_velvet_zari_stack_1794119599712.jpg',
      tag: '@divya_sharma',
      caption: 'Sangeet night styling with the royal maroon zari stack. Perfectly matched my lehenga!'
    },
    {
      img: '/assets/images/bangles_pastel_baby_pink_1794119601159.jpg',
      tag: '@sneha.creations',
      caption: 'Soft pastel pink silk threads with delicate seed pearls for haldi & mehendi celebrations.'
    },
    {
      img: '/assets/images/bangles_royal_blue_festive_1794119601242.jpg',
      tag: '@meera.kapoor',
      caption: 'Peacock blue & gold zardozi shine. So many compliments from all relatives!'
    },
    {
      img: '/assets/images/bangles_bridal_gift_box_1794119601859.jpg',
      tag: '@pooja_bridesmaid',
      caption: 'The satin gift box presentation made my sister tear up with joy.'
    },
    {
      img: '/assets/aistudio/WhatsApp_Image_2026-11-08_at_11.21.24_AM_e84ff41b.jpeg',
      tag: '@priya_couture',
      caption: 'Coordinated hair bows, earrings and silk kada. The ultimate aesthetic boutique vibe!'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#faf5f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Instagram Tag Header */}
        <a 
          href="https://www.instagram.com/ambitionbysha?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#8c2a44] hover:text-[#d84d72] mb-1 group transition-colors"
        >
          <Instagram className="w-4 h-4 text-[#d84d72] group-hover:scale-110 transition-transform" />
          <span className="hover:underline">@ambitionbysha · Follow Us on Instagram</span>
        </a>

        <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#3b121e] mb-2">
          See how our customers style their favourites ♡
        </h3>
        <p className="text-xs sm:text-sm text-[#8c4e5f] font-light max-w-md mx-auto mb-8">
          Tag us in your festive celebration stories to be featured on our artisan showcase!
        </p>

        {/* 6-Photo Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {PHOTOS.map((item, idx) => (
            <div 
              key={idx} 
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#f3dde3]"
            >
              <img
                src={item.img}
                alt={item.tag}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 text-white text-left">
                <p className="text-[10px] font-bold text-pink-200">{item.tag}</p>
                <p className="text-[9px] line-clamp-2 text-white/90 font-light mt-0.5">{item.caption}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-pink-300">
                  <Heart className="w-3 h-3 fill-pink-300" />
                  <span>Loved by brides</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
