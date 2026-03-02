import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code } = await request.json();

    // Validate school license code
    const { data: license, error: licenseError } = await supabase
      .from("school_licenses")
      .select("*")
      .eq("code", code)
      .single();

    if (licenseError || !license) {
      return NextResponse.json({ error: "Invalid license code" }, { status: 400 });
    }

    if (!license.active) {
      return NextResponse.json({ error: "License code is inactive" }, { status: 400 });
    }

    if (license.activation_count >= license.max_activations) {
      return NextResponse.json({ error: "License code has reached max activations" }, { status: 400 });
    }

    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return NextResponse.json({ error: "License code has expired" }, { status: 400 });
    }

    // Update user tier and increment activation count
    const { error: updateError } = await supabase
      .from("users")
      .update({
        tier: "SCHOOL",
        school_license_code: code,
        school_license_verified: true,
      })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // Increment activation count
    await supabase
      .from("school_licenses")
      .update({
        activation_count: license.activation_count + 1,
      })
      .eq("id", license.id);

    return NextResponse.json({ success: true, tier: "SCHOOL" });
  } catch (error) {
    console.error("Error validating school license:", error);
    return NextResponse.json({ error: "Failed to validate license" }, { status: 500 });
  }
}
