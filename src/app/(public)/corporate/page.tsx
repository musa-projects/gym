import type { Metadata } from "next";
import { CorporateContent } from "./content";

export const metadata: Metadata = {
  title: "Corporate Plans | Big Vision Gym",
  description:
    "Exclusive corporate wellness programs designed to boost employee health, productivity, and morale. Discounted group rates for teams of all sizes.",
};

export default function CorporatePage() {
  return <CorporateContent />;
}
