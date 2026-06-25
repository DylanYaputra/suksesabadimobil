import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, MapPin, Star, Truck, Car } from "lucide-react";
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

export default async function Home() {
  const carsData = await prisma.car.findMany({
    where: {
      deletedAt: null,
      featured: true,
      status: "Ready"
    },
    include: { brand: true },
    take: 6
  });
  
  // Parse images from JSON string to array
  const featuredCars: CarWithBrand[] = carsData.map(car => ({
    ...car,
    images: car.images ? JSON.parse(car.images) : []
  }));

  const testimonials = await prisma.testimonial.findMany({
    take: 3
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Mobil Bekas Berkualitas, <span className="text-blue-600">Harga Terbaik</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Temukan mobil impian Anda di Sukses Abadi Mobil. Showroom terpercaya di Medan dengan koleksi mobil bekas berkualitas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/catalog">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">Lihat Katalog</Button>
              </Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">Hubungi Kami</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa Pilih Kami?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keunggulan kami yang membuat Anda nyaman dan aman dalam membeli mobil bekas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Mobil Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Semua mobil kami telah melalui inspeksi menyeluruh untuk memastikan kualitas terbaik.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Harga Kompetitif</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Kami menawarkan harga terbaik di kelasnya dengan layanan purna jual yang memuaskan.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Terpercaya</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sudah ribuan pelanggan puas dengan layanan dan produk kami di Medan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featuredCars.length > 0 && (
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Mobil Pilihan</h2>
                <p className="text-muted-foreground">
                  Koleksi mobil bekas terbaik yang sedang populer
                </p>
              </div>
              <Link href="/catalog">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <Link key={car.id} href={`/catalog/${car.id}`}>
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
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Testimoni Pelanggan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Apa kata pelanggan tentang layanan kami
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.photo} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section id="location" className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lokasi Showroom</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kunjungi showroom kami di Medan
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Sukses Abadi Mobil</h3>
                  <p className="text-muted-foreground">
                    Jl. Tritura / A.H. Nasution No. A3A-A2A, Medan
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
