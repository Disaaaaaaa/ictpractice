"use server";
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setLocale(formData: FormData) {
  const profile = await requireProfile();
  const locale = String(formData.get("locale"));
  if (!["en", "ru", "kk"].includes(locale)) return;
  await createAdminClient().from("profiles").update({ locale }).eq("id", profile.id);
  revalidatePath("/", "layout");
}
