'user server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';

export async function AddAvatar(formData:FormData){

    const file = formData.get("avatar") as File;
    if (!file) {
      return { error: "No file uploaded." };
    }
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "Uploaded file must be an image." };
    }
  
    const supabase = await createClient();
  
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError || !user?.id) {
      return { error: "User not authenticated." };
    }
    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("avatar_url")
  .eq("id", userId)
  .single();

// if (profile?.avatar_url) {
//   // Derive the storage path from avatar_url if needed
//   const oldFilePath = profile.avatar_url
//   // Delete the existing file
//   await supabase.storage.from("avatars").remove([oldFilePath]);
// }


const filePath = `avatars/${userId}/${Date.now()}-${file.name}`;

const { error: uploadError } = await supabase.storage
  .from("avatars")
  .upload(filePath, file, { upsert: true });

if (uploadError) {
  console.error("Upload Error:", uploadError.message);
  return { error: uploadError.message };
}

const { data: publicUrlData } = supabase.storage
  .from("avatars")
  .getPublicUrl(filePath);
// if (urlError) {
//   console.error("Get Public URL Error:", urlError.message);
//   return { error: urlError.message };
// }
const avatarUrl = publicUrlData.publicUrl;

const { error: updateError } = await supabase
  .from("profiles")
  .update({ avatar_url: avatarUrl })
  .eq("id", userId);

if (updateError) {
  console.error("Profile Update Error:", updateError.message);
  return { error: updateError.message };
}

revalidatePath("/");

return { success: "Avatar updated successfully", avatarUrl };

  
}