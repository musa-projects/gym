import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const supabase = await createClient();

  // Look up the referral code in profiles table
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id, full_name, referral_code")
    .eq("referral_code", code)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    referrer_name: referrer.full_name,
    code,
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { referred_email, referred_name } = body;

  // Generate unique referral code if user doesn't have one
  let { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single();

  if (!profile?.referral_code) {
    const code = `BIGVISION-${nanoid(6).toUpperCase()}`;
    await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", user.id);
    profile = { referral_code: code };
  }

  // Create the referral record
  const { data: referral, error } = await supabase
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referral_code: profile.referral_code!,
      referred_email,
      referred_name,
      status: "pending",
      reward_type: "discount",
      expires_at: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ referral });
}
