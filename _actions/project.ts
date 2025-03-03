"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { TypeAddProjectSchema, TypeEditProjectSchema } from "@/schema/project";

export async function AddProject(values: TypeAddProjectSchema) {
  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();

  if (UserError || !user?.id) {
    return redirect("/login");
  }
  const user_id = user.id;

  // Convert the Date object to an ISO string

  // Convert the Date object to an ISO string
  const plannedEndDateISO = values.day.toISOString();

  const insertedProject = {
    title: values.title,
    planned_end_date: plannedEndDateISO, // Use ISO string here
    description: values?.description,
    user_id: user_id,
    priority: values.priority || "medium",
    color: values.color || "normal",
  };

  const { error } = await supabase.from("projects").insert(insertedProject);

  if (error) {
    console.log("supabase insert error", error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/webapp/projects");
  return { success: "Project have been added!" };
}

export async function EditProject(
  projectId: string,
  values: TypeEditProjectSchema,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();

  if (UserError || !user?.id) {
    return redirect("/login");
  }

  // Convert the Date object to an ISO string if it exists
  const plannedEndDateISO = values.day ? values.day.toISOString() : undefined;

  const updatedProject = {
    title: values.title,
    planned_end_date: plannedEndDateISO,
    description: values?.description,
    priority: values.priority || "medium",
  };

  // Update the project with the given ID
  const { error } = await supabase
    .from("projects")
    .update(updatedProject)
    .eq("id", projectId)
    .eq("user_id", user.id); // Ensure the user can only edit their own projects

  if (error) {
    console.log("supabase update error", error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/webapp/projects");
  return { success: "Project has been updated!" };
}

// New function to mark a project as completed
export async function CompleteProject(projectId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();

  if (UserError || !user?.id) {
    return redirect("/login");
  }

  // Get the current date and time in ISO format
  const now = new Date().toISOString();

  // Update the project's status and actual end date
  const { error } = await supabase
    .from("projects")
    .update({
      status: "Completed",
      actual_end_date: now,
    })
    .eq("id", projectId)
    .eq("user_id", user.id); // Ensure the user can only complete their own projects

  if (error) {
    console.log("supabase complete project error", error);
    return { error: "Something went wrong" };
  }

  revalidatePath("/webapp/projects");
  return { success: "Project has been marked as completed!" };
}
