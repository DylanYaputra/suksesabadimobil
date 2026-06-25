import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      include: { car: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const inquiry = await prisma.inquiry.create({
      data: {
        carId: data.carId,
        name: data.name,
        phone: data.phone,
        message: data.message
      }
    });
    return NextResponse.json(inquiry);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating inquiry' }, { status: 500 });
  }
}
