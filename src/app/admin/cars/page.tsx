"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

// Helper untuk memformat angka dengan titik
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Helper untuk menghapus format dan mengembalikan angka
const unformatNumber = (str: string) => {
  return parseInt(str.replace(/\./g, "")) || 0;
};

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
}

interface Brand {
  id: string;
  name: string;
}

export default function AdminCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brandId: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    kilometer: 0,
    color: "",
    plateNumber: "",
    transmission: "Manual",
    fuelType: "Bensin",
    engineCapacity: "",
    description: "",
    status: "Ready",
    featured: false,
    images: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  // State untuk menampilkan harga dengan format
  const [priceDisplay, setPriceDisplay] = useState("");
  const [kilometerDisplay, setKilometerDisplay] = useState("");

  const fetchData = () => {
    Promise.all([
      fetch("/api/cars").then(r => r.json()),
      fetch("/api/brands").then(r => r.json())
    ]).then(([carsData, brandsData]) => {
      setCars(carsData);
      setBrands(brandsData);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingCar(null);
    const newFormData = {
      name: "",
      brandId: brands[0]?.id || "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      kilometer: 0,
      color: "",
      plateNumber: "",
      transmission: "Manual",
      fuelType: "Bensin",
      engineCapacity: "",
      description: "",
      status: "Ready",
      featured: false,
      images: []
    };
    setFormData(newFormData);
    setPriceDisplay("");
    setKilometerDisplay("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brandId: car.brand.id,
      model: car.model,
      year: car.year,
      price: car.price,
      kilometer: car.kilometer,
      color: car.color,
      plateNumber: car.plateNumber,
      transmission: car.transmission,
      fuelType: car.fuelType,
      engineCapacity: car.engineCapacity,
      description: car.description,
      status: car.status,
      featured: car.featured,
      images: car.images
    });
    setPriceDisplay(car.price > 0 ? formatNumber(car.price) : "");
    setKilometerDisplay(car.kilometer > 0 ? formatNumber(car.kilometer) : "");
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
      };
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : "/api/cars";
      const response = await fetch(url, {
        method: editingCar ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setDialogOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus mobil ini?")) return;
    
    try {
      await fetch(`/api/cars/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manajemen Mobil</h1>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Mobil
        </Button>
      </div>

      <div className="grid gap-4">
        {cars.map((car: Car) => (
          <Card key={car.id}>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  {car.images[0] ? (
                    <Image 
                      src={car.images[0]} 
                      alt={car.name} 
                      width={128} 
                      height={80} 
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                    <Badge variant={car.status === 'Ready' ? 'default' : 'secondary'}>
                      {car.status}
                    </Badge>
                    {car.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                  <p className="text-muted-foreground">
                    {car.brand.name} • {car.year} • {car.transmission} • {formatPrice(car.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(car)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(car.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCar ? "Edit Mobil" : "Tambah Mobil Baru"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Mobil</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Merk</Label>
                <Select 
                  value={formData.brandId} 
                  onValueChange={(value) => setFormData({ ...formData, brandId: value })} 
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand: Brand) => (
                      <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input 
                  value={formData.model} 
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun</Label>
                <Input 
                  type="number" 
                  value={formData.year} 
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Harga</Label>
                <Input 
                  type="text" 
                  value={priceDisplay} 
                  onChange={(e) => {
                    // Hanya izinkan angka dan titik
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setPriceDisplay(value);
                    // Update formData dengan angka yang tidak diformat
                    setFormData({ ...formData, price: unformatNumber(value) });
                  }} 
                  onBlur={() => {
                    // Otomatis format saat user pindah focus
                    const num = unformatNumber(priceDisplay);
                    setPriceDisplay(num > 0 ? formatNumber(num) : "");
                  }}
                  placeholder="Contoh: 125.000.000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Kilometer</Label>
                <Input 
                  type="text" 
                  value={kilometerDisplay} 
                  onChange={(e) => {
                    // Hanya izinkan angka dan titik
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setKilometerDisplay(value);
                    // Update formData dengan angka yang tidak diformat
                    setFormData({ ...formData, kilometer: unformatNumber(value) });
                  }} 
                  onBlur={() => {
                    // Otomatis format saat user pindah focus
                    const num = unformatNumber(kilometerDisplay);
                    setKilometerDisplay(num > 0 ? formatNumber(num) : "");
                  }}
                  placeholder="Contoh: 50.000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Warna</Label>
                <Input 
                  value={formData.color} 
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Plat Nomor</Label>
                <Input 
                  value={formData.plateNumber} 
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Transmisi</Label>
                <Select 
                  value={formData.transmission} 
                  onValueChange={(value) => setFormData({ ...formData, transmission: value })} 
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bahan Bakar</Label>
                <Select 
                  value={formData.fuelType} 
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value })} 
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bensin">Bensin</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kapasitas Mesin</Label>
                <Input 
                  value={formData.engineCapacity} 
                  onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })} 
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex items-center gap-2">
                <Switch 
                  checked={formData.featured} 
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} 
                />
                <Label>Featured</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
                <Label>Gambar</Label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {formData.images.map((img: string, index: number) => (
                  <div key={index} className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image 
                      src={img} 
                      alt={`Image ${index + 1}`} 
                      fill 
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="outline" disabled={uploading} asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Upload Gambar"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingCar ? "Simpan Perubahan" : "Tambah Mobil"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
