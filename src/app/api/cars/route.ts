import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: { deletedAt: null },
      include: { brand: true },
      orderBy: { createdAt: 'desc' }
    });
    // Parse images from JSON string to array
    const carsWithImages = cars.map(car => ({
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    }));
    return NextResponse.json(carsWithImages);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching cars' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const car = await prisma.car.create({
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
        images: JSON.stringify(data.images || [])
      }
    });
    
    // Parse images back to array for response
    const carWithImages = {
      ...car,
      images: car.images ? JSON.parse(car.images) : []
    };
    
    return NextResponse.json(carWithImages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating car' }, { status: 500 });
  }
}
