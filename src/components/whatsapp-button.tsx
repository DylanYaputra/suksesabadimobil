"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";

export function WhatsAppButton() {
  const message = "Halo, saya ingin bertanya tentang mobil bekas di Sukses Abadi Mobil.";

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg">
        <MessageCircle className="h-7 w-7" />
      </Button>
    </a>
  );
}
