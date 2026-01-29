import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHash } from 'crypto';
import { cookies } from 'next/headers'; // [PENTING] Import cookies

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Pastikan pakai db.user (bukan db.admin)
    const admin = await db.user.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const hashedPassword = createHash('sha256').update(password).digest('hex');

    if (admin.password !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // [BARU] Buat Session Cookie (Tiket Masuk)
    // Ini yang akan dicek oleh Middleware nanti
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true, // Aman: JavaScript client tidak bisa baca/edit ini
      secure: process.env.NODE_ENV === 'production', // Wajib HTTPS di production (Vercel)
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // Berlaku 1 Hari
      path: '/',
    });

    return NextResponse.json({
      success: true,
      username: admin.username,
    });

  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}