import type { Metadata } from "next";
import { SignupForm } from "./form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Big Vision Gym account and start your fitness journey.",
};

export default function SignupPage() {
  return <SignupForm />;
}
