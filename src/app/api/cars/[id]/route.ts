import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: params.id, deletedAt: null },
      include: { brand: true }
    });
    
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    
    // Parse images from JSON string to array
    const carWithImages = {
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    };
    
    return NextResponse.json(carWithImages);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching car' }, { status: 500 });
  }
}

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
    
    const car = await prisma.car.update({
      where: { id: params.id },
      data: {
        name: data.name,
        brandId: data.brandId,
        model: data.model,
        year: parseInt(data.year),
        price: parseFloat(data.price),
        kilometer: parseInt(data.kilometer),
        color: data.color,
        plateNumber: data.plateNumber,
        transmission: data.transmission,
        fuelType: data.fuelType,
        engineCapacity: data.engineCapacity,
        description: data.description,
        status: data.status,
        featured: data.featured,
        images: JSON.stringify(data.images)
      }
    });
    
    // Parse images back to array for response
    const carWithImages = {
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    };
    
    return NextResponse.json(carWithImages);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating car' }, { status: 500 });
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

    await prisma.car.update({
      where: { id: params.id },
      data: { deletedAt: new Date() }
    });
    
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting car' }, { status: 500 });
  }
}
