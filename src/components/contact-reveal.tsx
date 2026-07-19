"use client";

import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactReveal({
  phone,
  whatsapp,
}: {
  phone: string;
  whatsapp: string | null;
}) {
  const [revealed, setRevealed] = useState(false);
  const wa = whatsapp || phone;

  if (!revealed) {
    return (
      <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
        <Phone className="size-4" /> Show contact number
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button size="lg" variant="outline" className="w-full" asChild>
        <a href={`tel:+91${phone}`}>
          <Phone className="size-4" /> {phone}
        </a>
      </Button>
      <Button
        size="lg"
        className="w-full bg-green-600 text-white hover:bg-green-700"
        asChild
      >
        <a
          href={`https://wa.me/91${wa}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
      </Button>
    </div>
  );
}
