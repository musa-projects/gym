import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowRight, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Trial Booked!",
  description: "Your free trial session has been booked. See you soon!",
};

export default function ThankYouPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <Card className="max-w-lg w-full border-primary/30">
        <CardContent className="p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>

          <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase text-foreground">
            See You Soon!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your free trial has been booked. A team member will reach out shortly to confirm your session.
          </p>

          <div className="mt-8 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              What to bring
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Comfortable workout clothes</li>
              <li>Water bottle</li>
              <li>A towel (or we provide one)</li>
              <li>Your best attitude</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\+/g, "")}?text=Hi!%20I%20just%20booked%20a%20free%20trial%20session.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-500 transition-colors hover:bg-green-500/20"
            >
              <MessageCircle className="h-5 w-5" /> Chat with Us on WhatsApp
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <Instagram className="h-5 w-5" /> Follow Us on Instagram
            </a>
          </div>

          <div className="mt-8">
            <Button href="/" variant="ghost">
              Back to Home <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
