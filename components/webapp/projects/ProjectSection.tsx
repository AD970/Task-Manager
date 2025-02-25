"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import AddProjectForm from "./AddProjectForm";
import { Project, Task } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { TaskItem } from "../tasks/TaskItem";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
type Props = {
  projects: Project[] | null;
};

function AddProjectCard() {
  return (
    <div
      className="col-span-12 sm:col-span-6 lg:col-span-4
     border-dashed rounded-lg border bg-card text-card-foreground shadow-sm flex gap-2 items-center justify-center  
     dark:hover:bg-secondary cursor-pointer duration-300  transition-colors
     "
    >
      <Dialog>
        <DialogTrigger>
          <div>
            <div className="flex gap-2 items-center">
              <Plus className="" />
              <h1 className="text-2xl">Add Project</h1>
            </div>
          </div>
          <div />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <AddProjectForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ProjectCardItemProps = {
  project: Project | null;
};

function ProjectCardItem({ project }: ProjectCardItemProps) {
  const [tasks, setTasks] = useState<Task[] | null>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true);
        const supabase = await createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user?.id) {
          return redirect("/login");
        }
        const user_id = user.id;
        if (!project?.id) {
          console.log("Something went wrong");
          throw Error("something went wrong");
        }
        const { data: taskData, error: taskError } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user_id)
          .eq("project_id", project?.id);

        setTasks(taskData);
      } catch (err) {
        console.log("something went wrong:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, []);

  console.log("color is:", project?.color);
  return (
    <Card
      className={cn(
         " col-span-12 sm:col-span-6 lg:col-span-4  ",
        project?.color && `bg-${project.color}-500/30`,
        // project?.priority === "high" && "border-destructive",
        // project?.priority === "low" && "border-muted-foreground"
      )}
    >
      {loading ? (
        <div className="">
          <CardHeader>
            <div className="flex items-center gap-2 w-full">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-8 " />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 ">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="w-full h-8" />
            {[1, 2].map((num) => (
              <div
                key={num}
                className="flex w-full space-x-2 items-center gap-2 "
              >
                <div className=" w-full  flex-col flex gap-2">
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="space-y-2">
            <div className="space-y-2 w-full">
              <Skeleton className="w-full h-4 " />
            </div>
          </CardFooter>
        </div>
      ) : (
        <div className="">
          <CardHeader>
            <div className="flex gap-2 items-center">
              <div
                className={`${
                  project?.priority === "high"
                    ? "bg-destructive text-destructive"
                    : project?.priority === "medium"
                      ? "bg-yellow-500 text-yellow-500"
                      : project?.priority === "bg-green-500 text-green-500"
                }  rounded-full h-4 w-4`}
              >
                {" "}
              </div>
              <h4
                className={`${
                  project?.priority === "high"
                    ? " text-destructive"
                    : project?.priority === "medium"
                      ? "text-yellow-500"
                      : project?.priority === "500 text-green-500"
                }  text-sm`}
              >
                {project?.priority &&
                  project?.priority?.charAt(0).toUpperCase() +
                    project?.priority?.slice(1)}
              </h4>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="font-bold tracking-tight">{project?.title}</h1>
              {tasks && tasks?.length < 4 ? (
                <Link
                  href={`projects/${project?.id}`}
                  className="text-xs text-muted-foreground"
                >
                  View More
                </Link>
              ) : tasks === null ? (
                <div className="">Please add some Tasks</div>
              ) : (
                <></>
              )}
            </div>
            <h4 className="text-muted-foreground ">{project?.description}</h4>

            {tasks?.slice(0, 5).map((task) => (
              <div key={task.id} className="">
                <TaskItem task={task} />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className="flex flex-col  gap-2 w-full">
              <p className="text-xs text-muted-foreground">
                {Math.round(project?.progress || 0)}% completed
              </p>
              <Progress value={project?.progress} className="h-2" />
            </div>
          </CardFooter>
        </div>
      )}

      <div />
    </Card>
  );
}
export default function ProjectSection({ projects }: Props) {
  return (
    <div className="grid grid-cols-12   p-4 gap-4">
      <AddProjectCard />
      {projects?.map((project, index) => (
        <ProjectCardItem key={index} project={project} />
      ))}
    </div>
  );
}
