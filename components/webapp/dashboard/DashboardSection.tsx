import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/types";
import { MoreVertical, Share2 } from "lucide-react";
import React from "react";

type Props = {
  tasks: Task[] | null;
};

function OverAllInformation({ tasks }: Props) {
  const doneTasksCount = tasks?.filter((task) => task.checked === true).length;
  const pendingTasksCount = tasks?.filter(
    (task) => task.checked === false,
  ).length;
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
