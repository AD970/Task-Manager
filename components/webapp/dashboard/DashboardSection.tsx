import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/types";
import { MoreVertical, Share2 } from "lucide-react";
import React from "react";

type Props = {
  tasks: Task[] | null;
};

function OverAllInformation({ tasks }: Props) {
  const doneTasksCount = tasks?.filter((task) => task.checked).length || 0;
    const totalTasks = tasks?.length || 0;
  const pendingTasksCount = tasks?.filter(
    (task) => task.checked === false,
  ).length;
  const progress = totalTasks > 0 ? (doneTasksCount / totalTasks) * 100 : 0;
  return (
    <Card className="col-span-6 lg:col-span-4">
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
      </CardContent>
      <CardFooter>
      <div className="flex flex-col  gap-2 w-full">
              <p className="text-xs text-muted-foreground">
                {Math.round(progress || 0)}% completed
              </p>
              <Progress value={progress} className="h-2" />
            </div>
      </CardFooter>
    </Card>
  );
}
export default function DashboardSection({ tasks }: Props) {
  return (
    <div className="grid-cols-12 grid gap-4 p-4 py-4 ">
      {/* over all tasks */}
      <OverAllInformation tasks={tasks} />
    </div>
  );
}
