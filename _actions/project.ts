"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { TypeAddProjectSchema } from "@/schema/project";

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
