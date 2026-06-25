"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Filter } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface Car {
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

interface Brand {
  id: string;
  name: string;
}

export default function Catalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    brandId: "",
    transmission: "",
    fuelType: "",
    status: "",
    year: "",
    sort: "newest"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/cars").then(r => r.json()),
      fetch("/api/brands").then(r => r.json())
    ]).then(([carsData, brandsData]) => {
      setCars(carsData);
      setBrands(brandsData);
      setLoading(false);
    });
  }, []);

  const filteredCars = cars.filter((car) => {
    if (search && !car.name.toLowerCase().includes(search.toLowerCase()) && 
        !car.brand.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filters.brandId && car.brand.id !== filters.brandId) return false;
    if (filters.transmission && car.transmission !== filters.transmission) return false;
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
    if (filters.status && car.status !== filters.status) return false;
    if (filters.year && car.year.toString() !== filters.year) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "km-low": return a.kilometer - b.kilometer;
      case "km-high": return b.kilometer - a.kilometer;
      default: return 0;
    }
  });

  const currentYears = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Katalog Mobil</h1>
          
          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Cari mobil..." 
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Merk</Label>
                  <Select 
                    value={filters.brandId} 
                    onValueChange={(value) => setFilters({ ...filters, brandId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua merk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua merk</SelectItem>
                      {brands.map((brand: Brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tahun</Label>
                  <Select 
                    value={filters.year} 
                    onValueChange={(value) => setFilters({ ...filters, year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua tahun</SelectItem>
                      {currentYears.map((year: number) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua status</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Transmisi</Label>
                  <Select 
                    value={filters.transmission} 
                    onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua transmisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua transmisi</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bahan Bakar</Label>
                  <Select 
                    value={filters.fuelType} 
                    onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua bahan bakar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua bahan bakar</SelectItem>
                      <SelectItem value="Bensin">Bensin</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Urutkan</Label>
                  <Select 
                    value={filters.sort} 
                    onValueChange={(value) => setFilters({ ...filters, sort: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="oldest">Terlama</SelectItem>
                      <SelectItem value="price-low">Harga: Rendah ke Tinggi</SelectItem>
                      <SelectItem value="price-high">Harga: Tinggi ke Rendah</SelectItem>
                      <SelectItem value="km-low">KM: Rendah ke Tinggi</SelectItem>
                      <SelectItem value="km-high">KM: Tinggi ke Rendah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car: Car) => (
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
                          <p className="text-sm text-muted-foreground">
                            {car.brand.name} • {car.year} • {car.transmission} • {car.kilometer.toLocaleString('id-ID')} km
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-primary mt-4">
                        {formatPrice(car.price)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak ada mobil ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter pencarian Anda</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
