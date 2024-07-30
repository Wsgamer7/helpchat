import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log("cofirming");
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type) {
    const supabase = supabaseServer();

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token_hash,
      type: "email",
    });
    if (error) {
      console.log(error);
    }
    if (!error) {
      return NextResponse.redirect(`${origin}`);
    }
  }

  // if "next" is in param, use it as the redirect URL
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
