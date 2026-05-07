import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type AdminSession = {
  userId: string;
  email: string | null;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const email = typeof claimsData.claims.email === "string" ? claimsData.claims.email : null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return { userId, email };
}

export async function requireAdmin() {
  const admin = await getAdminSession();

  if (!admin) {
    redirect("/login?next=/dashboard");
  }

  return admin;
}
