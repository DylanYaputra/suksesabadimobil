import Link from "next/link";
import Image from "next/image";
import { Car, MapPin, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-6 w-6" />
              <span className="text-xl font-bold">Sukses Abadi Mobil</span>
            </div>
            <p className="text-blue-100">
              Showroom mobil bekas terpercaya di Medan.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-blue-100">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+62 822-6710-2765</span>
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Jl. Tritura / A.H. Nasution No. A3A-A2A, Medan</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Link</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-blue-100 hover:text-white hover:underline">
              Beranda
            </Link>
              <Link href="/catalog" className="block text-blue-100 hover:text-white hover:underline">
              Katalog
            </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm text-blue-200">
          © {new Date().getFullYear()} Sukses Abadi Mobil. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
