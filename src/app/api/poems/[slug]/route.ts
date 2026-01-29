import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Props = {
  params: Promise<{ slug: string }>;
};

// Helper (Sama kayak di atas)
function generateExcerpt(content: string) {
  return content
    .replace(/\s+/g, ' ')
    .substring(0, 120)
    .trim() + '...';
}

export async function GET(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const poem = await db.poem.findUnique({ where: { slug: params.slug } });
    if (!poem) return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    return NextResponse.json(poem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch poem' }, { status: 500 });
  }
}

// PUT update poem (Update: Auto Excerpt)
export async function PUT(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const body = await request.json();
    
    const existingPoem = await db.poem.findUnique({ where: { slug: params.slug } });
    if (!existingPoem) return NextResponse.json({ error: 'Poem not found' }, { status: 404 });

    // Cek Featured Logic (Tetap dipertahankan)
    if (body.isFeatured === true) {
      const featuredPoems = await db.poem.findMany({
        where: { isFeatured: true, NOT: { id: existingPoem.id } },
        orderBy: { updatedAt: 'asc' },
        select: { id: true }
      });
      if (featuredPoems.length >= 2) {
        await db.poem.update({ where: { id: featuredPoems[0].id }, data: { isFeatured: false } });
      }
    }

    // [BARU] Jika konten berubah, update excerpt otomatis
    let newExcerpt = existingPoem.excerpt;
    if (body.content) {
      newExcerpt = generateExcerpt(body.content);
    }

    const poem = await db.poem.update({
      where: { slug: params.slug },
      data: {
        ...body,
        excerpt: newExcerpt, // Update excerpt
      },
    });

    return NextResponse.json(poem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update poem' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const existingPoem = await db.poem.findUnique({ where: { slug: params.slug } });
    if (!existingPoem) return NextResponse.json({ error: 'Poem not found' }, { status: 404 });
    await db.poem.delete({ where: { slug: params.slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete poem' }, { status: 500 });
  }
}