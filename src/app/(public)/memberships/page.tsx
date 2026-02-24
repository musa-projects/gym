import type { Metadata } from "next";
import { MembershipsContent } from "./content";

export const metadata: Metadata = {
  title: "Membership Plans",
  description:
    "Choose from Basic, Premium, and VIP membership plans at Big Vision Gym. No contracts, cancel anytime.",
};

export default function MembershipsPage() {
  return <MembershipsContent />;
}
