import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Tentukan Path Penting
  const isAdminPage = path.startsWith('/admin');
  const isLoginPage = path === '/login'; // Karena folder login sudah dipindah ke src/app/login

  // 2. Ambil Tiket (Cookie)
  const cookie = request.cookies.get('admin_session');
  const isDianggapLogin = cookie?.value === 'true';

  // --- LOGIKA PENJAGAAN ---

  // A. Jika mau masuk Admin TAPI belum login -> Tendang ke Login
  if (isAdminPage && !isDianggapLogin) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // B. Jika sudah Login TAPI mau buka halaman Login lagi -> Oper ke Dashboard
  if (isLoginPage && isDianggapLogin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi: Middleware hanya memantau path ini
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};