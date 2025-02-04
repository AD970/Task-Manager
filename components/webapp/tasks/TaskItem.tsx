'use client'
import { OnCheckTask } from "@/_actions/task"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Task } from "@/types"
import { useState } from "react"
import { FaFlag } from "react-icons/fa"

type TaskItemProps = {
    task: Task,
    overdue ?: true
  }
  function formatTaskDate(dateString: string): string {
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
  

 export function TaskItem({task,overdue}:TaskItemProps){



  const priorities = [
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
 
  const [checked, setChecked] = useState(task.checked) // Optimistic state
  const {toast} = useToast()
  const handleCheck = async () => {
    setChecked(prev => !prev); // Optimistic update
  
    const response = await OnCheckTask(task.id, checked);
  
    if (response?.error) {
      toast({
        title: response.error,
        variant: "destructive",
      });
      setChecked(prev => !prev); // Revert state if failed
    } else {
      toast({
        title: response.success,
      });
    }
  };

    return(
      <div  className={cn("flex w-full items-center gap-2 ",)}> 
      <Checkbox
      checked={checked}
      onCheckedChange={handleCheck}
      variant={
        task.priority === "high"
          ? "destructive"
          : "default" // both low and medium default to "default"
      }
    />      <div className={cn("border-b w-full flex justify-between items-center")}>
        <h1>{task.title}</h1>
        <div className="flex gap-2">
        <span className={cn("text-sm  space-x-1",overdue ? 'text-red-500' : 'text-muted-foreground')}>
       <span>{overdue && 'Overdue'}</span>   
       <span> {task.planned_end_date ?   formatTaskDate(task.planned_end_date)  : ""}</span>
          
        </span>
        </div>
      </div>
    </div>

    )
  }