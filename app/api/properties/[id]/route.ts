import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase'; // أضفنا سوبابيز هنا كخطة بديلة
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 1. البحث في قاعدة البيانات المحلية (الخيار الأسرع)
    let property = await prisma.localProperty.findUnique({
      where: { id: id },
    });

    // 2. إذا لم يوجد محلياً (مثلاً تم إضافته من جهاز آخر)، نجلبه من سوبابيز
    if (!property) {
      console.log("العقار غير موجود محلياً، جاري الجلب من السحابة...");
      const { data: cloudData, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (cloudData && !error) {
        // 3. تخزينه محلياً فوراً لكي يفتح بسرعة في المرة القادمة
        property = await prisma.localProperty.create({
          data: {
            id: cloudData.id,
            title: cloudData.title,
            location: cloudData.location,
            price: parseFloat(cloudData.price) || 0,
            rooms: parseInt(cloudData.rooms) || 0,
            area: parseFloat(cloudData.area) || 0,
            image_url: cloudData.image_url,
            description: cloudData.description,
            type: cloudData.type,
          }
        });
      }
    }

    if (property) {
      return NextResponse.json(property);
    }

    return NextResponse.json({ error: 'العقار غير موجود في أي مكان' }, { status: 404 });

  } catch (error: any) {
    console.error("خطأ في API التفاصيل:", error.message);
    return NextResponse.json({ error: 'خطأ في الخادم المحلي' }, { status: 500 });
  }
}