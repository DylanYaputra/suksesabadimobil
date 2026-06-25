import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        photo: data.photo,
        content: data.content
      }
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.testimonial.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting testimonial' }, { status: 500 });
  }
}
