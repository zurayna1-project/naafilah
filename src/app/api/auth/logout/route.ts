import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // HAPUS TIKET (COOKIE) DARI SERVER
  cookieStore.delete('admin_session');

  return NextResponse.json({ success: true });
}