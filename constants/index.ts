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



export function formatTaskDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const now = new Date();
  today.setHours(0, 0, 0, 0); // Today at midnight

  // Tomorrow starts exactly one day after today
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Day after tomorrow is two days after today
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  if (date < now) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (date >= today && date < tomorrow) {
    // Task is scheduled for today: include the time
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return ` ${hours}:${minutes}`;
  } else if (date >= tomorrow && date < dayAfterTomorrow) {
    // Task is scheduled for tomorrow
    return "Tomorrow";
  } else {
    // Otherwise, format as "Mon DD"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}
