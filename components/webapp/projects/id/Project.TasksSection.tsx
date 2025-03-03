"use client";
import { formatTaskDate } from "@/constants";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChartNoAxesGantt,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Edit,
  List,
  ListFilterPlus,
  Plus,
  Search,
  Text,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
import { OnCheckTask } from "@/_actions/task";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTaskModal from "./AddTask.Modal";
import MobileTaskList from "./mobile/MobileTaskList";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import TaskInformationForm from "../../tasks/TaskInformationForm";
type Props = {};

export default function ProjectTasksSection({
  tasks,
  project_id,
}: {
  tasks: Task[] | null;
  project_id: string;
}) {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const filteredTasks = tasks?.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const completedTasks = filteredTasks?.filter((task) => task.checked === true);
  const inProgressTasks = filteredTasks?.filter(
    (task) => task.checked === false,
  );

  const [inProgressTasksCollapsible, setInProgressTasksCollapsible] =
    useState(true);
  const [completedTasksCollapsible, setCompletedTasksCollapsible] =
    useState(true);

  if (isMobile) {
    return (
      <div className="">
        <MobileTaskList
          tasks={tasks}
          project_id={project_id}
          search={search}
          setSearch={setSearch}
          inProgressTasks={inProgressTasks || null}
          completedTasks={completedTasks || null}
        />
      </div>
    );
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <Tabs defaultValue="list" className="flex flex-col w-full">
          <div className="flex  border-b py-4 justify-between items-center w-full">
            <TabsList>
              <TabsTrigger
                value="timeline"
                className="flex gap-2  items-center"
              >
                <ChartNoAxesGantt className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger className="flex gap-2  items-center" value="list">
                {" "}
                <List className="h-4 w-4" /> List
              </TabsTrigger>
            </TabsList>
            <div className="">
              <TabsContent value="list">
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
                        <Button className="">
                          <Plus />
                          New Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className={
                          "lg:max-w-screen-lg overflow-y-scroll max-h-screen"
                        }
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
              </TabsContent>
            </div>

            <TabsContent value="timeline">Coming Soon!</TabsContent>
          </div>
          <TabsContent value="list">
            <TasksTables
              completedTasks={(completedTasks && completedTasks) || null}
              inProgressTasks={inProgressTasks || null}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TasksTables({
  inProgressTasks,
  completedTasks,
}: {
  inProgressTasks: Task[] | null;
  completedTasks: Task[] | null;
}) {
  const [inProgressTasksCollapsible, setInProgressTasksCollapsible] =
    useState(true);
  const [completedTasksCollapsible, setCompletedTasksCollapsible] =
    useState(true);

  return (
    <div className="">
      {/* in progress */}
      <Collapsible
        className="space-y-4"
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
              <span>In Progress Tasks</span>{" "}
              <span className="text-muted-foreground text-xs">
                {inProgressTasks?.length}
              </span>{" "}
            </h4>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Table>
            <TableCaption>Tasks</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={1}>
                  <ChevronDown className="h-4 w-4" />{" "}
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4" /> Task
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <Text className="h-4 w-4" /> Description
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Estimation
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <ListFilterPlus className="h-4 w-4" /> Priority
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgressTasks?.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </TableBody>
          </Table>
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
        <CollapsibleContent>
          <Table>
            <TableCaption>Tasks</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <ChevronDown className="h-4 w-4" />{" "}
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <CircleCheckBig className="h-4 w-4" /> Task
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <Text className="h-4 w-4" /> Description
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Estimation
                  </div>
                </TableHead>
                <TableHead>
                  {" "}
                  <div className="flex items-center gap-2">
                    <ListFilterPlus className="h-4 w-4" /> Priority
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedTasks?.map((task) => (
                <TaskItem task={task} key={task.id} />
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const [checked, setChecked] = useState(task.checked);
  const { toast } = useToast();
  const handleCheck = async () => {
    setChecked((prev) => !prev); // Optimistic update

    const response = await OnCheckTask(
      task.id,
      checked,
      task?.project_id || "",
    );

    if (response?.error) {
      toast({
        title: response.error,
        variant: "destructive",
      });
      setChecked((prev) => !prev); // Revert state if failed
    } else {
      toast({
        title: response.success,
      });
    }
  };
  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={checked} onCheckedChange={handleCheck} />
      </TableCell>
      <TableCell>
        {/* <TooltipProvider>
          
        <Tooltip>
          <TooltipTrigger>{task.title}</TooltipTrigger>
          <TooltipContent>
            <Button c variant={'outline'} >
            Edit
            <Edit className='h-4 w-4'/>
            </Button>
          </TooltipContent>
        </Tooltip> 
        </TooltipProvider> */}
      </TableCell>
      <TableCell className="text-xs dark:text-gray-300 text-gray-700">
        {task.description || "-"}
      </TableCell>
      <TableCell>
        {task.planned_end_date && formatTaskDate(task.planned_end_date)}
      </TableCell>
      <TableCell>
        <div
          className={cn(
            " rounded-lg",
            task.priority === "high"
              ? "text-red-500"
              : task.priority === "medium"
                ? "text-yellow-500"
                : "text-muted",
          )}
        >
          {task.priority &&
            task?.priority?.charAt(0).toUpperCase() + task?.priority?.slice(1)}
        </div>
      </TableCell>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className={"lg:max-w-screen-lg overflow-y-scroll max-h-screen"}
          >
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskInformationForm task={task} />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
