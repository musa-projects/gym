import type { Metadata } from "next";
import { ShopContent } from "./content";

export const metadata: Metadata = {
  title: "Shop | Big Vision Gym",
  description: "Premium gym merchandise, supplements, and accessories from Big Vision Gym.",
};

export default function ShopPage() {
  return <ShopContent />;
}
