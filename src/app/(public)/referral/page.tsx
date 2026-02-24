import type { Metadata } from "next";
import { ReferralContent } from "./content";

export const metadata: Metadata = {
  title: "You've Been Referred! | Big Vision Gym",
  description: "Your friend thinks you'd love Big Vision Gym. Claim your exclusive referral offer today.",
};

export default function ReferralPage() {
  return <ReferralContent />;
}
