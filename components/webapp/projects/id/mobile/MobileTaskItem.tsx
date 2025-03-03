import { OnCheckTask } from "@/_actions/task";
import { formatTaskDate } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import TaskInformationForm from "@/components/webapp/tasks/TaskInformationForm";

export default function MobileTaskItem({
  task,
  project_id,
}: {
  task: Task;
  project_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    function updateScreenSize() {
      setScreenSize({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      });
    }
    updateScreenSize(); // Initial check
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  const { isMobile, isTablet } = screenSize;
  const { toast } = useToast();
  const [checked, setChecked] = useState(task.checked);

  const handleCheck = async () => {
    setChecked((prev) => !prev); // Optimistic update
    const response = await OnCheckTask(
      task.id,
      checked,
      task?.project_id || project_id || "",
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

  function handleSelect() {
    setIsOpen(true);
  }

  return (
    <div className={cn("flex w-full items-center gap-2")}>
      <Checkbox
        checked={checked}
        onCheckedChange={handleCheck}
        variant={
          task.priority === "high" ? "destructive" : "default" // both low and medium default to "default"
        }
      />
      <div
        onClick={handleSelect}
        className={cn(
          "border-b cursor-pointer w-full flex justify-between items-center",
        )}
      >
        <h1
          className={`${task.checked === true ? "line-through text-muted-foreground" : ""}`}
        >
          {task.title}
        </h1>
        <div className="flex gap-2">
          <span className={cn("text-sm space-x-1")}>
            <span>
              {task.planned_end_date
                ? formatTaskDate(task.planned_end_date)
                : ""}
            </span>
          </span>
        </div>
      </div>

      {/* Move Sheet outside of conditional rendering for better state management */}
      {(isMobile || isTablet) && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle />
          <SheetContent
            side={isMobile ? "top" : "right"}
            className="max-h-screen overflow-y-scroll min-h-screen w-full"
          >
            <TaskInformationForm setIsOpen={setIsOpen} task={task} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
