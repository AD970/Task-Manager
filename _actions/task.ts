"use server";

import { TypeAddTaskSchema, TypeEditTaskSchema } from "@/schema/task";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function AddTask(values: TypeAddTaskSchema) {
  const supabase = await createClient();
  const {
    data: { user },
    error: UserError,
  } = await supabase.auth.getUser();

  if (UserError || !user?.id) {
    return redirect("/login");
  }
  const user_id = user.id;

  // Create a new Date object from the provided day.
  const plannedEndDate = new Date(values.day);
  const [hour, minute] = values.hour.split(":").map(Number);
  plannedEndDate.setHours(hour, minute, 0, 0);

  // Convert the Date object to an ISO string
  const plannedEndDateISO = plannedEndDate.toISOString();

  const insertedTask = {
    title: values.title,
    priority: values.priority,
    planned_end_date: plannedEndDateISO, // Use ISO string here
    description: values?.description,
    user_id: user_id,
  };

  const { error } = await supabase.from("tasks").insert(insertedTask);

  if (error) {
    return { error: "Something went wrong" };
  }
  revalidatePath("/webapp/tasks");
}



export async function OnCheckTask(task_id: number, task_checked: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return { error: "User not authenticated" }; // Don't redirect, just return an error
  }

  const user_id = user.id;

  const { error: onCheckError } = await supabase
    .from("tasks")
    .update({ checked: !task_checked }) // Toggle checked state
    .eq("id", task_id);

  if (onCheckError) {
    return { error: "Something went wrong, please try again" };
  }

  // Revalidate the page so the UI updates
  revalidatePath("/webapp/tasks");

  return { success: "Task completed" };
}



export async function EditTask(task_id: number, values: TypeEditTaskSchema) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    return { error: "User not authenticated" };
  }

  const user_id = user.id;

  const plannedEndDate = new Date(values.day);
  const [hour, minute] = values.hour.split(":").map(Number);
  plannedEndDate.setHours(hour, minute, 0, 0);

  // Convert the Date object to an ISO string
  const plannedEndDateISO = plannedEndDate.toISOString();

  const { error: updateError } = await supabase
    .from("tasks")
    .update({
      title: values.title,
      priority: values.priority,
      description: values.description,
      planned_end_date: plannedEndDateISO, // ✅ Corrected
    })
    .eq("id", task_id)
    .eq("user_id", user_id); // Ensure task belongs to user

  if (updateError) {
    return { error: updateError ,};
  }

  revalidatePath('/webapp/tasks')
  return { success: "Task updated successfully" };
}
