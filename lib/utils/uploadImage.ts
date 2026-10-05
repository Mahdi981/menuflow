import { createClient } from "@/lib/supabase/client";

export async function uploadImage(file: File): Promise<string | null> {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("restaurant-assets")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from("restaurant-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;
}