import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // In a real app, you'd verify against database
    // For now, just check if token exists
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Error verifying auth:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
