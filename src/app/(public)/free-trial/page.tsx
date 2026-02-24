import type { Metadata } from "next";
import { FreeTrialContent } from "./content";

export const metadata: Metadata = {
  title: "Book a Free Trial",
  description:
    "Book your free trial session at Big Vision Gym. No commitment, no pressure — just results.",
};

export default function FreeTrialPage() {
  return <FreeTrialContent />;
}
