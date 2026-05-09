// app/api/properties/[id]/route.ts
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // البحث في قاعدة البيانات المحلية (SQLite)
    const property = await prisma.localProperty.findUnique({
      where: { id: params.id },
    });

    if (property) {
      return NextResponse.json(property);
    }
    return NextResponse.json({ error: 'العقار غير موجود محلياً' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الخادم المحلي' }, { status: 500 });
  }
}