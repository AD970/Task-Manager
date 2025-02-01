import { Input } from "@/components/ui/input";
import { Plus, ChevronDown } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaFlag } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskForm from "@/components/webapp/tasks/TaskForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TaskSection from "@/components/webapp/tasks/TaskSection";
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
    .eq("user_id", user_id);

  if (taskError) {
    console.log("something is off");
  }
  return (
    <div className="grid grid-cols-12 max-h-screen">
      <div className="h-screen flex col-span-8  flex-col gap-4 ">
        <div className="flex items-center p-4 border-b ">
          <h1>All tasks</h1>
        </div>
        <TaskSection tasks={taskData} />
      </div>
      <div className="border-l h-screen col-span-4">
        <p>ad</p>
      </div>
    </div>
  );
}
