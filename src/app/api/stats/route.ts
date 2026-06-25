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

    const totalCars = await prisma.car.count({ where: { deletedAt: null } });
    const readyCars = await prisma.car.count({ where: { deletedAt: null, status: 'Ready' } });
    const soldCars = await prisma.car.count({ where: { deletedAt: null, status: 'Sold' } });
    const totalInquiries = await prisma.inquiry.count();

    return NextResponse.json({
      totalCars,
      readyCars,
      soldCars,
      totalInquiries
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
  }
}
