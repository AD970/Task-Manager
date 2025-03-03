import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { EditProjectSchema, TypeEditProjectSchema } from "@/schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { EditProject } from "@/_actions/project";
import { useToast } from "@/hooks/use-toast";
import { FaFlag } from "react-icons/fa6";
import { priorities } from "@/constants";
import { DateTimePicker } from "@/components/ui/DateTimePicker-rdsx";
import { Input } from "@/components/ui/input";
import { useState, useTransition, useEffect } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { parseISO } from "date-fns";

type EditProjectFormProps = {
  project: {
    id: string;
    title: string;
    description?: string;
    planned_end_date: string;
    priority: string;
    color: string;
  };
  onClose?: () => void;
};

export default function EditProjectForm({ project, onClose }: EditProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  // Parse the ISO date string to a Date object
  const plannedDate = project.planned_end_date ? parseISO(project.planned_end_date) : new Date();

  const form = useForm<TypeEditProjectSchema>({
    resolver: zodResolver(EditProjectSchema),
    defaultValues: {
      title: project.title || "",
      day: plannedDate,
      description: project.description || "",
      priority: project.priority || "medium",
    },
  });

  async function onSubmit(values: TypeEditProjectSchema) {
    startTransition(async () => {
       await EditProject(project.id, values).then((data) => {
            if (data?.error) {
                setError(data?.error);
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                });
            } else if (data?.success) {
                toast({
                    title: data.success,
                });
                if (onClose) {
                    onClose();
                }
            }
        });
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Project Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Edit Project"
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex items-center gap-4"
              >
                {priorities.map((priority) => (
                  <div
                    key={priority.value}
                    className="flex space-x-2 items-center"
                  >
                    <RadioGroupItem value={priority.value} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FaFlag className={cn(priority.color)} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{priority.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />

      
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <DateTimePicker />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end mt-4">
          <DialogClose asChild>
            <Button type="button" variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} variant={"default"}>
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                <span>Updating Project</span>
              </div>
            ) : (
              "Update Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}