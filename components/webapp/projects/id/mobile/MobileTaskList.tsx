import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddTaskModal from "../AddTask.Modal";
import MobileTaskItem from "./MobileTaskItem";

export default function MobileTaskList({
  tasks,
  project_id,
  search,
  setSearch,
  inProgressTasks,
  completedTasks,
}: {
  tasks: Task[] | null;
  project_id: string;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  inProgressTasks: Task[] | null;
  completedTasks: Task[] | null;
}) {
  const [inProgressTasksCollapsible, setInProgressTasksCollapsible] =
    useState(true);
  const [completedTasksCollapsible, setCompletedTasksCollapsible] =
    useState(true);

  return (
    <div className="p-4 space-y-8">
      <div className="relative">
        {/* Plus Icon */}
        <div className="absolute left-2.5 top-3 h-4 pointer-events-none w-4 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <div className="flex gap-2 items-center">
          <Input
            className="w-full rounded-lg bg-background pl-8"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"icon"} className="">
                <Plus className="" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
            >
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-scroll">
                <AddTaskModal project_id={project_id} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Collapsible
        className="space-y-4 "
        onOpenChange={setInProgressTasksCollapsible}
        open={inProgressTasksCollapsible}
      >
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-1">
            <ChevronRight
              className={cn(
                "duration-300 h-4 w-4 text-muted-foreground",
                inProgressTasksCollapsible ? "rotate-90" : "",
              )}
            />
            <h4 className="text-sm  space-x-1">
              {" "}
              <span className="">In Progress Tasks</span>{" "}
              <span className="text-muted-foreground text-xs">
                {inProgressTasks?.length}
              </span>{" "}
            </h4>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          {inProgressTasks?.map((task) => (
            <MobileTaskItem task={task} project_id={project_id} key={task.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* completed tasks */}
      <Collapsible
        className="space-y-4"
        onOpenChange={setCompletedTasksCollapsible}
        open={completedTasksCollapsible}
      >
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-1">
            <ChevronRight
              className={cn(
                "duration-300 h-4 w-4 text-muted-foreground",
                completedTasksCollapsible ? "rotate-90" : "",
              )}
            />
            <h4 className="text-sm  space-x-1">
              {" "}
              <span>Completed Tasks</span>{" "}
              <span className="text-muted-foreground text-xs">
                {completedTasks?.length}
              </span>{" "}
            </h4>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
          {completedTasks?.map((task) => (
            <MobileTaskItem task={task} project_id={project_id} key={task.id} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
