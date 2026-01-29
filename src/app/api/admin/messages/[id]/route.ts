import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Props = {
  params: Promise<{ id: string }>;
};

// PATCH update status message (Dibaca/Belum) - [BARU]
export async function PATCH(request: NextRequest, props: Props) {
  try {
    const params = await props.params;
    const body = await request.json();

    const message = await db.contactMessage.update({
      where: { id: params.id },
      data: { read: body.read },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// DELETE message by ID
export async function DELETE(request: NextRequest, props: Props) {
  try {
    const params = await props.params;

    const existingMessage = await db.contactMessage.findUnique({
      where: { id: params.id },
    });

    if (!existingMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await db.contactMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}