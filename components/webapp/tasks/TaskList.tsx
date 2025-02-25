"use client";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import React, { useState, useTransition } from "react";
import { TypeOnCheckSchema, OnCheckSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskItem } from "./TaskItem";
type Props = {
  tasks: null | Task[];
  loadingTask: string;
};

export default function TaskList({ tasks, loadingTask }: Props) {
  const [importantCollapsible, setImportantCollapsible] = useState(true);
  const [allTasksCollapsible, setAllTasksCollapsible] = useState(true);
  const [todayTasksCollapsible, setTodayTasksCollapsible] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [weekTasksCollapsible, setWeekTasksCollapsible] = useState(true);
  const [overdueTasksCollapsible, setOverdueTasksCollapsible] = useState(true);

  const importantTasks = tasks?.filter((task) => task.priority === "high");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

  const now = new Date(); // Current time

  const twoMinutesAgo = new Date();
  twoMinutesAgo.setMinutes(now.getMinutes() - 2); // 2 hours ago from now

  const todayTasks = tasks?.filter((task) => {
    if (!task.planned_end_date) return false;
    const plannedDate = new Date(task.planned_end_date);
    return (
      plannedDate >= today &&
      plannedDate < tomorrow &&
      plannedDate > twoMinutesAgo
    ); // Strictly today
  });

  const overdueTasks = tasks?.filter((task) => {
    if (!task.planned_end_date) return false;
    const plannedDate = new Date(task.planned_end_date);
    return plannedDate < twoMinutesAgo; // More than 2 hours late
  });

  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7); // 7 days from today

  const weekTasks = tasks?.filter((task) => {
    if (!task.planned_end_date) return false;
    const taskDate = new Date(task.planned_end_date);
    return taskDate >= tomorrow && taskDate < weekEnd; // Future tasks within the week
  });

  const form = useForm<TypeOnCheckSchema>({
    resolver: zodResolver(OnCheckSchema),
    defaultValues: {
      checked: false,
    },
  });

  return (
    <div className="p-4 ">
      <div className="px-8 flex flex-col gap-4">
        {/* overdue */}
        <Collapsible
          className="space-y-4"
          open={overdueTasksCollapsible}
          onOpenChange={setOverdueTasksCollapsible}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1">
              <ChevronRight
                className={cn(
                  "duration-300 h-4 w-4 text-muted-foreground",
                  overdueTasksCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm  space-x-1">
                {" "}
                <span>Overdue</span>{" "}
                <span className="text-muted-foreground text-xs">
                  {overdueTasks?.length}
                </span>{" "}
              </h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {overdueTasks?.map((task) => (
              <TaskItem key={task.id} task={task} overdue={true} />
            ))}
          </CollapsibleContent>
        </Collapsible>
        {/* today */}
        <Collapsible
          className="space-y-4"
          open={todayTasksCollapsible}
          onOpenChange={setTodayTasksCollapsible}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-1">
              <ChevronRight
                className={cn(
                  "duration-300 h-4 w-4 text-muted-foreground",
                  todayTasksCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm  space-x-1">
                {" "}
                <span>Today</span>{" "}
                <span className="text-muted-foreground text-xs">
                  {todayTasks?.length}
                </span>{" "}
              </h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {todayTasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </CollapsibleContent>
        </Collapsible>
        {/* week */}
        <Collapsible
          className="space-y-4"
          open={weekTasksCollapsible}
          onOpenChange={setWeekTasksCollapsible}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2">
              <ChevronRight
                className={cn(
                  "duration-300 h-4 w-4 text-muted-foreground",
                  weekTasksCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm  space-x-1">
                {" "}
                <span>Week</span>{" "}
                <span className="text-muted-foreground text-xs">
                  {weekTasks?.length}
                </span>{" "}
              </h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {weekTasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </CollapsibleContent>
        </Collapsible>

        {/* all tasks */}
        <Collapsible
          className="space-y-4"
          open={allTasksCollapsible}
          onOpenChange={setAllTasksCollapsible}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2">
              <ChevronRight
                className={cn(
                  "duration-300 h-4 w-4 text-muted-foreground",
                  weekTasksCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm  space-x-1">
                {" "}
                <span>All Tasks</span>{" "}
                <span className="text-muted-foreground text-xs">
                  {tasks?.length}
                </span>{" "}
              </h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {tasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </CollapsibleContent>
        </Collapsible>

        {loadingTask && (
          <div className="flex w-full space-x-2 items-center gap-2 ">
            <Skeleton className="w-4 h-4" />
            <div className=" w-full  flex-col flex gap-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full  h-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
