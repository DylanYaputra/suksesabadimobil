"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, CheckCircle, XCircle, MessageSquare, Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Stats {
  totalCars: number;
  readyCars: number;
  soldCars: number;
  totalInquiries: number;
}

interface CarType {
  id: string;
  name: string;
  brand: { id: string; name: string };
  model: string;
  year: number;
  price: number;
  kilometer: number;
  color: string;
  plateNumber: string;
  transmission: string;
  fuelType: string;
  engineCapacity: string;
  description: string;
  status: string;
  featured: boolean;
  images: string[];
  createdAt: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/cars").then(r => r.json())
    ]).then(([statsData, carsData]) => {
      setStats(statsData);
      setCars(carsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/cars">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Mobil
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Mobil</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCars || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mobil Ready</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.readyCars || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mobil Sold</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.soldCars || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiry</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalInquiries || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* List Mobil Terbaru */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mobil Terbaru</h2>
          <Link href="/admin/cars">
            <Button variant="outline">Lihat Semua</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.slice(0, 6).map((car) => (
            <Link key={car.id} href={`/admin/cars`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  {car.images[0] ? (
                    <Image 
                      src={car.images[0]} 
                      alt={car.name} 
                      width={400} 
                      height={300} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Car className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-4 right-4" variant={car.status === 'Ready' ? 'default' : 'secondary'}>
                    {car.status}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">{car.brand.name} • {car.year}</p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary mt-4">
                    {formatPrice(Number(car.price))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
