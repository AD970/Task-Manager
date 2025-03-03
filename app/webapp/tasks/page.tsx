import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TaskSection from "@/components/webapp/tasks/TaskSection";
import TaskInformation from "@/components/webapp/tasks/TaskInformation";
import { SidebarTrigger } from "@/components/ui/sidebar";
type Props = {};

export default async function TaskPage({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const user_id = user?.id;
  if (userError || !user_id) {
    return redirect("login");
  }

  const { data: taskData, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user_id)
    .eq("checked", false);

  if (taskError) {
    console.log("something is off");
  }

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user_id);

  return (
    <div className="grid grid-cols-12 max-h-screen">
      <div className="h-screen flex col-span-12  md:col-span-12 lg:col-span-8 flex-col gap-4 ">
        <div className="flex gap-2 items-center p-4 border-b ">
          <SidebarTrigger className="sm:hidden" />
          <h1>All tasks</h1>
        </div>
        <TaskSection tasks={taskData} projects={projectData} />
      </div>
      <div className="border-l h-screen hidden sm:hidden lg:inline-block  lg:col-span-4">
        <TaskInformation />
      </div>
    </div>
  );
}
