import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* Tambahkan logo kamu di sini! Taruh file logo.png di folder public */}
          {/* <Image src="/logo.png" alt="Sukses Abadi Mobil" width={60} height={40} /> */}
          <span className="text-2xl font-bold text-primary">Sukses Abadi Mobil</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-base font-medium hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link href="/catalog" className="text-base font-medium hover:text-primary transition-colors">
            Katalog
          </Link>
          <Link href="/#testimonials" className="text-base font-medium hover:text-primary transition-colors">
            Testimoni
          </Link>
          <Link href="/#location" className="text-base font-medium hover:text-primary transition-colors">
            Lokasi
          </Link>
        </nav>
      </div>
    </header>
  );
}
