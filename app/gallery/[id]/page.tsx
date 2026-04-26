'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PropertyDetails() {
  const { id } = useParams(); // هذا السطر يسحب رقم العقار من الرابط
  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!error) setProperty(data);
    };
    if (id) fetchDetails();
  }, [id]);

  if (!property) return <p className="text-center p-20">جاري تحميل التفاصيل...</p>;

  return (
    <div>
      {/* هنا نضع كود التصميم الذي عرضناه سابقاً لعرض الصور والسعر والوصف */}
      <h1>{property.title}</h1>
      <p>{property.price} ج.م</p>
    </div>
  );
}