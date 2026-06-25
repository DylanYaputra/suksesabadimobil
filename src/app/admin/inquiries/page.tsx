"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, MessageSquare, Car } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  car: { id: string; name: string; price: number };
  createdAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    fetch("/api/inquiries")
      .then(r => r.json())
      .then(data => setInquiries(data));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Inquiry Pelanggan</h1>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                    <Badge variant="outline">{inquiry.car.name}</Badge>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{inquiry.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>Rp {inquiry.car.price.toLocaleString('id-ID')}</span>
                    </div>
                    {inquiry.message && (
                      <div className="flex items-start gap-2 mt-2">
                        <MessageSquare className="h-4 w-4 mt-0.5" />
                        <span>{inquiry.message}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(inquiry.createdAt).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {inquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada inquiry</h3>
            <p className="text-muted-foreground">Tunggu hingga ada pelanggan yang menghubungi</p>
          </div>
        )}
      </div>
    </div>
  );
}
