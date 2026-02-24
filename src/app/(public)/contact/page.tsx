import type { Metadata } from "next";
import { ContactContent } from "./content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Big Vision Gym. Visit us, call, WhatsApp, or send a message. We'd love to hear from you.",
};

export default function ContactPage() {
  return <ContactContent />;
}
