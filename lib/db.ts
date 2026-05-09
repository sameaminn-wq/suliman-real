import { PrismaClient } from '@prisma/client';
import { supabase } from './supabase';

// تمنع هذه الطريقة فتح اتصالات متعددة بقاعدة البيانات أثناء التطوير
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * محرك الجلب الهجين
 * يبحث في الجهاز أولاً، وإذا لم يجد شيئاً يجلب من سوبابيز ويخزن محلياً
 */
export const getProperties = async () => {
  try {
    // 1. جلب البيانات من ملف SQLite المحلي
    const localData = await prisma.localProperty.findMany({
      orderBy: { updatedAt: 'desc' }
    });

    // 2. إذا كانت القاعدة المحلية فارغة، نسحب البيانات من السحابة
    if (localData.length === 0) {
      console.log("القاعدة المحلية فارغة، يتم الجلب من سوبابيز...");
      const { data: remoteData, error } = await supabase
        .from('properties')
        .select('*');

      if (!error && remoteData) {
        // 3. تخزين البيانات في الجهاز للاستخدام في المرات القادمة
        for (const item of remoteData) {
          await prisma.localProperty.create({
            data: {
              id: item.id,
              title: item.title,
              location: item.location,
              price: parseFloat(item.price) || 0,
              rooms: parseInt(item.rooms) || 0,
              area: parseFloat(item.area) || 0,
              image_url: item.image_url || '',
            }
          });
        }
        return remoteData;
      }
    }

    return localData;
  } catch (error) {
    console.error("خطأ في محرك البيانات الهجين:", error);
    // كخطة بديلة (Fallback) عند حدوث أي خطأ في القاعدة المحلية
    const { data } = await supabase.from('properties').select('*');
    return data;
  }
};