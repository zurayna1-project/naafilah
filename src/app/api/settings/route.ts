import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// [PENTING] Baris ini memaksa API untuk selalu cek data terbaru, jangan pakai cache
export const dynamic = 'force-dynamic';

// GET site settings
export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          siteTitle: 'Zurayna',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    let settings = await db.siteSettings.findFirst();

    if (!settings) {
      settings = await db.siteSettings.create({
        data: body,
      });
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}