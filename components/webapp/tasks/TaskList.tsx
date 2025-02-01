"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";

type Props = {
  tasks: null | Task[];
  loadingTask: string;
};

export default function TaskList({ tasks, loadingTask }: Props) {
  const [importantCollapsible, setImportantCollapsible] = useState(true);
  const [allTasksCollapsible, setAllTasksCollapsible] = useState(true);
  const [todayTasksCollapsible, setTodayTasksCollapsible] = useState(true);
  const importantTasks = tasks?.filter((task) => task.priority === "high");
  console.log("important tasks are", importantTasks);

  const today = new Date();
  today.setHours(0,0,0,0)
  const todayTasks = tasks?.filter(task => {
    if (!task.planned_end_date) return false;
    const plannedDate = new Date(task.planned_end_date);
    return plannedDate >= today 

    
  })
  return (
    <div className="p-4 ">
      <div className="px-8 flex flex-col gap-4">
        <Collapsible
          className="space-y-4"
          open={importantCollapsible}
          onOpenChange={setImportantCollapsible}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2">
              <ChevronRight
                className={cn(
                  "duration-300 h-4 w-4 text-muted-foreground",
                  importantCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm text-muted-foreground">Important tasks</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {importantTasks?.map((task) => (
              <div key={task.id} className="flex w-full items-center gap-2 ">
                <Checkbox
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "low"
                        ? "default"
                        : "default"
                  }
                />
                <div className={cn("border-b w-full")}>
                  <h1>{task.title}</h1>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

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
                  allTasksCollapsible ? "rotate-90" : "",
                )}
              />
              <h4 className="text-sm text-muted-foreground">Medium To Low Tasks</h4>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            {tasks
              ?.filter((task) => task.priority != "high")
              .map((task) => (
                <div key={task.id} className="flex w-full items-center gap-2 ">
                  <Checkbox
                    variant={
                      task.priority === "high"
                        ? "destructive"
                        : task.priority === "low"
                          ? "default"
                          : "default"
                    }
                  />
                  <div className={cn("border-b w-full")}>
                    <h1>{task.title}</h1>
                  </div>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>

        {loadingTask && (
          <div className="flex w-full items-center gap-2 ">
            <Skeleton className="w-4 h-4" />
            <div className=" w-full flex-col gap-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
