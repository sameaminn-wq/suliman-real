import Image from 'next/image'; // استيراد المكون المحسن
import { MapPin, Maximize, BedDouble, Bath } from 'lucide-react';

interface PropertyProps {
  title: string;
  price: string;
  location: string;
  area: number;
  rooms: number;
  image: string;
  type: string;
}

export default function PropertyCard({ title, price, location, area, rooms, image, type }: PropertyProps) {
  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
      {/* Container الصورة مع الحفاظ على الأبعاد */}
      <div className="relative h-72 overflow-hidden">
        <Image 
          src={image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000'} 
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // التحميل هنا Lazy افتراضياً وهو ممتاز للمصفوفات الكبيرة
        />
        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#0F172A] z-10">
          {type}
        </div>
      </div>
      
      <div className="p-7">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#0F172A] leading-tight flex-1">{title}</h3>
          <span className="text-[#10B981] font-bold text-lg whitespace-nowrap mr-2">{price} ج.م</span>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <MapPin size={16} className="ml-1 text-[#10B981]" />
          {location}
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-50">
          <div className="flex flex-col items-center">
            <Maximize size={18} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold">{area} م²</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-50">
            <BedDouble size={18} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold">{rooms} غرف</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath size={18} className="text-gray-400 mb-1" />
            <span className="text-xs font-bold">2 حمام</span>
          </div>
        </div>
      </div>
    </div>
  );
}