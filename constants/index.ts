import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { Task } from "@/types";
export const priorities = [
  {
    value: "high",
    name: "High Priority",
    color: "text-red-500",
  },
  {
    value: "medium",
    name: "Medium Priority",
    color: "text-yellow-500",
  },
  {
    value: "low",
    name: "Low Priority",
    color: "text-muted",
  },
];




 export function calculateProgress(tasks: Task[], period: "week" | "month") {
  const now = new Date();

  // Define date range based on period
  const range =
    period === "week"
      ? { start: startOfWeek(now), end: endOfWeek(now) }
      : { start: startOfMonth(now), end: endOfMonth(now) };

  // Filter tasks within the range
  console.log("range is",range)
  const filteredTasks = tasks.filter((task) =>{
   const taskDate = parseISO( task?.planned_end_date || '')
 return    isWithinInterval(new Date(taskDate), range)
});

  // Count completed tasks
  const completedTasks = filteredTasks.filter((task) => task.checked).length;

  // Calculate progress percentage
  return filteredTasks.length > 0 ? (completedTasks / filteredTasks.length) * 100 : 0;
}

