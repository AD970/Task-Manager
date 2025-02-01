"use client";
import { useState } from "react";
import { Task } from "@/types";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

type TaskSectionProps = {
  tasks: null | Task[];
};
export default function TaskSection({ tasks }: TaskSectionProps) {
  const [loadingTask, setLoadingTask] = useState("");
  return (
    <div className="w-full ">
      <div className="space-y-8">
        <TaskForm setLoadingTask={setLoadingTask} />
        <TaskList loadingTask={loadingTask} tasks={tasks} />
      </div>
    </div>
  );
}
