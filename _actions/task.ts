"use server";

import { TypeAddTaskSchema } from "@/schema/task";
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
