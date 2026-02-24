import type { Metadata } from "next";
import { ClassesContent } from "./content";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Explore our diverse class offerings: HIIT, Strength, CrossFit, Yoga, Boxing, and Personal Training at Big Vision Gym.",
};

export default function ClassesPage() {
  return <ClassesContent />;
}
