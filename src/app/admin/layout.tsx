"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Home, Users, Star, MessageSquare, LayoutDashboard, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, router, pathname]);

  if (status === "loading" || (status === "unauthenticated" && pathname !== "/admin/login")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="p-6 border-b border-blue-700">
          <Link href="/admin" className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-blue-700 ${pathname === "/admin" ? "bg-blue-700" : ""}`}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/cars">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-blue-700 ${pathname.startsWith("/admin/cars") ? "bg-blue-700" : ""}`}
            >
              <Car className="h-4 w-4 mr-2" />
              Mobil
            </Button>
          </Link>
          <Link href="/admin/brands">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-blue-700 ${pathname === "/admin/brands" ? "bg-blue-700" : ""}`}
            >
              <Home className="h-4 w-4 mr-2" />
              Merk
            </Button>
          </Link>
          <Link href="/admin/testimonials">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-blue-700 ${pathname === "/admin/testimonials" ? "bg-blue-700" : ""}`}
            >
              <Star className="h-4 w-4 mr-2" />
              Testimoni
            </Button>
          </Link>
          <Link href="/admin/inquiries">
            <Button 
              variant="ghost" 
              className={`w-full justify-start text-white hover:bg-blue-700 ${pathname === "/admin/inquiries" ? "bg-blue-700" : ""}`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Inquiry
            </Button>
          </Link>
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <Button 
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
