import SettingsSection from "@/components/webapp/settings/SettingsSection";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function SettingsPage({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const user_id = user?.id;

  if (!user_id) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();
  if (profileError) {
    console.error(profileError);
    return <div>Error loading profile</div>;
  }
  return (
    <div>
      <SettingsSection profile={profileData} />
    </div>
  );
}
