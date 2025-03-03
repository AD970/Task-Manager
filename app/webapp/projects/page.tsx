import ProjectSection from "@/components/webapp/projects/ProjectSection";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
type Props = {};

export default async function ProjectsPage({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const user_id = user?.id;
  if (userError || !user_id) {
    return redirect("login");
  }

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user_id)
    .neq("status", "Completed");

  if (projectError) {
    console.log("something is off");
  }
  return (
    <div className="max-h-screen min-h-screen overflow-y-auto">
      <div className="p-4 gap-2 border-b flex items-center">
        <SidebarTrigger className="sm:hidden" />

        <h1>My Projects</h1>
      </div>
      <ProjectSection projects={projectData} />
    </div>
  );
}
