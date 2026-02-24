import type { Metadata } from "next";
import { ForgotPasswordForm } from "./form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Big Vision Gym account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
