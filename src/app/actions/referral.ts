"use server";

import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function generateReferralCode() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const code = `BIGVISION-${nanoid(6).toUpperCase()}`;

  const { error } = await supabase
    .from("profiles")
    .update({ referral_code: code })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true, code };
}

export async function sendReferralInvite(data: {
  email: string;
  name?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  // Get user's referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single();

  if (!profile?.referral_code) {
    return {
      success: false,
      error: "No referral code found. Please generate one first.",
    };
  }

  const { error } = await supabase.from("referrals").insert({
    referrer_id: user.id,
    referral_code: profile.referral_code,
    referred_email: data.email,
    referred_name: data.name || null,
    status: "pending",
    reward_type: "discount",
    expires_at: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function submitCorporateInquiry(data: {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company_size: string;
  plan_type: string;
  notes?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("corporate_accounts").insert({
    company_name: data.company_name,
    contact_name: data.contact_name,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone || null,
    company_size: data.company_size,
    plan_type: data.plan_type,
    notes: data.notes || null,
    status: "inquiry",
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
