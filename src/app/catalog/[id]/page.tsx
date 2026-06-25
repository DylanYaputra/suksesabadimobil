import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Fuel, Gauge, Settings, Car, Palette, DollarSign, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";
import prisma from "@/lib/db";

interface CarWithBrand {
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
}

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const carData = await prisma.car.findUnique({
    where: { id, deletedAt: null },
    include: { brand: true }
  });

  if (!carData) {
    notFound();
  }

  // Parse images from JSON string to array
  const car: CarWithBrand = {
    ...carData,
    images: carData.images ? JSON.parse(carData.images) : []
  };

  const message = `Halo, saya ingin bertanya tentang:

📱 *Detail Mobil*
📌 Nama: ${car.name}
📌 Merk: ${car.brand.name}
📌 Model: ${car.model}
📌 Tahun: ${car.year}
📌 Warna: ${car.color}
📌 Transmisi: ${car.transmission}
📌 Bahan Bakar: ${car.fuelType}
📌 Kilometer: ${car.kilometer.toLocaleString('id-ID')} km
📌 Harga: ${formatPrice(Number(car.price))}
📌 Plat: ${car.plateNumber}

Mohon informasinya, terima kasih!`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video relative overflow-hidden rounded-2xl bg-muted">
                {car.images[0] ? (
                  <Image 
                    src={car.images[0]} 
                    alt={car.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>

              {car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {car.images.map((img: string, index: number) => (
                    <div key={index} className="aspect-square relative overflow-hidden rounded-xl bg-muted">
                      <Image 
                        src={img} 
                        alt={`${car.name} ${index + 1}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Deskripsi</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{car.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{car.name}</h1>
                      <p className="text-muted-foreground">{car.brand.name} • {car.model} • {car.year}</p>
                    </div>
                    <Badge variant={car.status === 'Ready' ? 'default' : 'secondary'}>
                      {car.status}
                    </Badge>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-6">
                    {formatPrice(Number(car.price))}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Spesifikasi</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Tahun</span>
                        <span className="font-medium">{car.year}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gauge className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Kilometer</span>
                        <span className="font-medium">{car.kilometer.toLocaleString('id-ID')} km</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Transmisi</span>
                        <span className="font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Fuel className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Bahan Bakar</span>
                        <span className="font-medium">{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Settings className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Kapasitas Mesin</span>
                        <span className="font-medium">{car.engineCapacity}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Warna</span>
                        <span className="font-medium">{car.color}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-muted-foreground" />
                        <span className="text-muted-foreground flex-1">Plat Nomor</span>
                        <span className="font-medium">{car.plateNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Hubungi via WhatsApp
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
