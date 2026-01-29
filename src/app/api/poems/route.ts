import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Fungsi Helper untuk buat Excerpt otomatis
function generateExcerpt(content: string) {
  return content
    .replace(/\s+/g, ' ') // Mengganti enter/spasi berlebih dengan 1 spasi
    .substring(0, 120)    // Ambil 120 karakter pertama
    .trim() + '...';      // Tambah titik tiga
}

// GET all poems
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false';
    const featured = searchParams.get('featured');
    const latest = searchParams.get('latest');
    const showAll = searchParams.get('all') === 'true';

    let where: any = {};
    if (!showAll) where.published = published;
    if (featured === 'true') where.isFeatured = true;

    let poems;
    if (latest === 'true') {
      poems = await db.poem.findMany({ where, orderBy: { createdAt: 'desc' }, take: 4 });
    } else {
      poems = await db.poem.findMany({ where, orderBy: { createdAt: 'desc' } });
    }

    return NextResponse.json(poems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch poems' }, { status: 500 });
  }
}

// POST create new poem (Update: Auto Excerpt)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, coverImage, category, isFeatured, published, author } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // [BARU] Buat excerpt otomatis di sini
    const autoExcerpt = generateExcerpt(content);

    const poem = await db.poem.create({
      data: {
        title,
        slug,
        content,
        excerpt: autoExcerpt, // Pakai yang otomatis
        coverImage: coverImage || null,
        category: category || null,
        isFeatured: isFeatured || false,
        published: published !== false,
        author: author || 'Admin',
      },
    });

    return NextResponse.json(poem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create poem' }, { status: 500 });
  }
}