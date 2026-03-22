"use server";

import { supabase } from "@/lib/supabase";

export async function submitBuildLog(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const project_link = (formData.get("project_link") as string)?.trim() || null;

  if (!name || !description) {
    return { error: "Name and description are required." };
  }

  const { data, error } = await supabase
    .from("build_logs")
    .insert({ name, description, project_link })
    .select()
    .single();

  if (error) {
    return { error: "Failed to post. Try again." };
  }

  return { success: true, log: data };
}
