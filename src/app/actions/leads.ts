"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitFreeTrial(formData: {
  name: string;
  phone: string;
  email?: string;
  goal: string;
  preferredTime: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("free_trial_leads").insert({
    full_name: formData.name,
    phone: formData.phone,
    email: formData.email || null,
    fitness_goal: formData.goal,
    preferred_time: formData.preferredTime,
    status: "new",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("contact_submissions").insert({
    full_name: formData.name,
    email: formData.email,
    phone: formData.phone || null,
    message: formData.message,
    status: "new",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
