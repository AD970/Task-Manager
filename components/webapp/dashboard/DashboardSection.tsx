import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Project, Task } from "@/types";
import {
  CalendarDays,
  Circle,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Dot,
  MoreVertical,
  Share2,
  SquareDashedKanban,
} from "lucide-react";
import React from "react";
import { calculateProgress } from "@/constants";
import { Calendar } from "@/components/ui/calendar";
import { parseISO } from "date-fns";
import { WeeklyProgressChart } from "@/components/charts/pie/WeeklyProgressChart";
import CircularProgress from "@/components/ui/circular-progress";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  tasks: Task[] | null;
  projects: Project[] | null;
  className?: string;
};

export default function DashboardSection({ tasks, projects }: Props) {
  const weeklyProgress = tasks ? calculateProgress(tasks, "week") : 0;
  console.log("week progress is :", weeklyProgress);
  return (
    <div className=" grid grid-cols-12    gap-4 p-4 py-4 ">
      {/* over all tasks */}
      <OverAllInformation
        projects={projects}
        tasks={tasks}
        className=" lg:order-1 order-1"
      />
      <WeeklyProgressCard
        weeklyProgress={Math.floor(weeklyProgress)}
        className="lg:order-2 order-3"
      />
      <CalendarCard tasks={tasks} className="order-2 lg:order-3" />
      <ProjectsSection projects={projects} className="order-4 lg:order-4" />
    </div>
  );
}

function OverAllInformation({ tasks, projects, className }: Props) {
  const doneTasksCount = tasks?.filter((task) => task.checked).length || 0;
  const totalTasks = tasks?.length || 0;

  const pendingTasksCount = tasks?.filter(
    (task) => task.checked === false,
  ).length;

  const progress = totalTasks > 0 ? (doneTasksCount / totalTasks) * 100 : 0;

  const doneProjectsCount =
    projects?.filter((project) => project.status === "Completed").length || 0;
  return (
    <Card className={cn("col-span-12 md:col-span-6 lg:col-span-4", className)}>
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Overall Information</CardTitle>
          <div className="flex gap-2 items-center">
            <Share2 className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {doneTasksCount}
            </h1>
            <p className="text-muted-foreground text-sm max-w-24">
              Tasks done for all time
            </p>
            <Separator orientation="vertical" className="h-12" />
          </div>
          <div className="flex gap-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {pendingTasksCount}
            </h1>
            <p className="text-muted-foreground text-sm max-w-24">
              Tasks in progress
            </p>
          </div>
        </div>
        <div className="flex flex-col  gap-2 w-full">
          <p className="text-xs text-muted-foreground">
            {Math.round(progress || 0)}% completed
          </p>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-2  mt-4">
          <Card>
            <CardHeader className="flex items-center justify-center">
              <CircleDashed />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <h1 className="font-bold text-3xl">{projects?.length}</h1>
              <h1 className="text-sm text-muted-foreground">Projects</h1>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center">
              <CircleDotDashed />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <h1 className="font-bold text-3xl">{projects?.length}</h1>
              <h1 className="text-muted-foreground text-center text-sm">
                In Progress
              </h1>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-center">
              <CircleDot />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <h1 className="font-bold text-3xl">{doneProjectsCount}</h1>
              <h1 className="text-sm text-muted-foreground">Done</h1>
            </CardContent>
          </Card>
        </div>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
function CalendarCard({
  tasks,
  className,
}: {
  tasks: Task[] | null;
  className?: string;
}) {
  const unFinishedTasks = tasks?.filter((task) => task.checked === false);
  const taskDates = unFinishedTasks
    ?.map((task) => task.planned_end_date) // ✅ Extract task dates
    .filter(Boolean) // ✅ Remove any undefined/null values
    .map((date) => parseISO(date || "")); // ✅ Convert to Date objects

  const today = new Date();

  return (
    <Card className={cn("col-span-12 md:col-span-6 lg:col-span-4", className)}>
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Calendar </CardTitle>
          <div className="flex gap-2 items-center">
            <CalendarDays className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full flex items-center justify-center ">
        <Calendar
          mode="single"
          initialFocus
          modifiers={{
            taskDays: taskDates || [], // ✅ Mark task days
          }}
          modifiersClassNames={{
            taskDays:
              "bg-secondary dark:text-primary  text-secondary-foreground  rounded-full", // ✅ Highlighted day styles
          }}
          className="p-2  "
        />
      </CardContent>
    </Card>
  );
}

function WeeklyProgressCard({
  weeklyProgress,
  className,
}: {
  weeklyProgress: number;
  className?: string;
}) {
  return (
    <Card className={cn("col-span-12 lg:col-span-4", className)}>
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Weekly Tasks Progress</CardTitle>
          <div className="flex gap-2 items-center">
            <Share2 className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <div className="py-4">
        <WeeklyProgressChart weeklyProgress={weeklyProgress} />
      </div>
    </Card>
  );
}

function ProjectsSection({
  projects,
  className,
}: {
  projects: Project[] | null;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 col-span-12  ", className)}>
      {projects && projects.length > 0 && (
        <div className="space-y-2 col-span-12">
          <div className="flex justify-between items-center">
            <h1 className="text-lg tracking-tight font-medium ">
              Last Projects
            </h1>
            <Link
              className="text-xs text-muted-foreground hover:text-primary duration-300"
              href={"/webapp/projects"}
            >
              View More
            </Link>
          </div>
          <div className="hidden md:grid gap-4 grid-cols-12 ">
            {projects
              ?.reverse()
              .slice(0, 3)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
          <div className="md:hidden grid  gap-4 grid-cols-12 ">
            {projects
              ?.reverse()
              .slice(0, 2)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4">
      <CardHeader className="">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{project.title}</CardTitle>
          <div className="flex gap-2 items-center">
            <CircularProgress progress={project.progress || 0} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 items-center">
          {" "}
          <Circle className="h-2 w-2 dark:bg-white bg-black rounded-full" />{" "}
          {project.status}
        </div>
        <p className="text-muted-foreground text-xs">{project.description}</p>
      </CardContent>
    </Card>
  );
}
