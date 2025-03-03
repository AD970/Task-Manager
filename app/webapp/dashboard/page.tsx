import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSection from "@/components/webapp/dashboard/DashboardSection";
import { createClient } from "@/utils/supabase/server";
import { Bell, MoreVertical, Share2 } from "lucide-react";
import React from "react";

type Props = {};

async function Hero() {
  return (
    <main className="grid gap-4 grid-cols-12 p-4">
      <div className="md:col-span-4 space-y-4 bg-zinc-800 dark:bg-slate-400 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          Overall information
          <div className="flex gap-4">
            <Share2 />
            <MoreVertical />
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function page({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }
  const user_id = user?.id;
  if (!user_id) {
    console.error("No user id");
    return <div>No User Id!</div>;
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user_id);

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user_id);

  return (
    <div className="flex flex-col  min-h-screen">
      <div className="flex items-center px-4 py-3 justify-between ">
        <div className="flex gap-4 items-center ">
          <SidebarTrigger className="sm:hidden" />
          <h1 className="text-lg  font-bold ">Hi, {profile?.display_name}!</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bell />
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <DashboardSection projects={projects} tasks={tasks} />
    </div>
  );
}
