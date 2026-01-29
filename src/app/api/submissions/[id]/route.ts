import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

// Helper (Sama lagi)
function generateExcerpt(content: string) {
  return content
    .replace(/\s+/g, ' ')
    .substring(0, 120)
    .trim() + '...';
}

export async function DELETE(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    await db.poemSubmission.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus' }, { status: 500 });
  }
}

// POST: Approve (Update: Auto Excerpt 120 char)
export async function POST(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const submission = await db.poemSubmission.findUnique({ where: { id: params.id } });
    if (!submission) return NextResponse.json({ error: 'Data tidak ada' }, { status: 404 });

    const slug = submission.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
    
    // [BARU] Pakai fungsi generateExcerpt
    const autoExcerpt = generateExcerpt(submission.content);

    const newPoem = await db.poem.create({
      data: {
        title: submission.title,
        content: submission.content,
        author: submission.name,
        slug: slug,
        excerpt: autoExcerpt, // Otomatis
        coverImage: submission.coverImage,
        published: false,
      }
    });

    await db.poemSubmission.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, poemId: newPoem.id });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyetujui' }, { status: 500 });
  }
}