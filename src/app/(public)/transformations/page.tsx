import type { Metadata } from "next";
import { TransformationsContent } from "./content";

export const metadata: Metadata = {
  title: "Transformations",
  description:
    "Real transformations from real members at Big Vision Gym. See the proof — your story could be next.",
};

export default function TransformationsPage() {
  return <TransformationsContent />;
}
