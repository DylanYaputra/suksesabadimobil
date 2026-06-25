import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const brand = await prisma.brand.update({
      where: { id: params.id },
      data: { name: data.name }
    });
    return NextResponse.json(brand);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating brand' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.brand.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting brand' }, { status: 500 });
  }
}
