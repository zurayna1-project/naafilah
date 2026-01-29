import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: Pengunjung mengirim karya
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi sederhana
    if (!body.name || !body.title || !body.content) {
      return NextResponse.json({ error: 'Mohon lengkapi data' }, { status: 400 });
    }

    const submission = await db.poemSubmission.create({
      data: {
        name: body.name,
        email: body.email || '',
        title: body.title,
        content: body.content,
        coverImage: body.coverImage || null, // [BARU] Simpan gambar cover
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Gagal mengirim karya' }, { status: 500 });
  }
}

// GET: Admin melihat daftar kiriman
export async function GET() {
  try {
    const submissions = await db.poemSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }
}