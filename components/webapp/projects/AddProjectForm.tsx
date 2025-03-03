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
import { AddTaskSchema, TypeAddTaskSchema } from "@/schema/task";
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
import { AddTask } from "@/_actions/task";
import { useToast } from "@/hooks/use-toast";
import { FaFlag } from "react-icons/fa6";
import { priorities } from "@/constants";
import { DateTimePicker } from "@/components/ui/DateTimePicker-rdsx";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { AddProjectSchema, TypeAddProjectSchema } from "@/schema/project";
import { DialogClose } from "@/components/ui/dialog";
import { AddProject } from "@/_actions/project";
import { LoaderCircle } from "lucide-react";
import { ColorPicker } from "./ColorPickerForm";
type Props = {};

export default function AddProjectForm({}: Props) {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  const form = useForm<TypeAddProjectSchema>({
    resolver: zodResolver(AddProjectSchema),
    defaultValues: {
      title: "",
      day: new Date(),
      description: "",
      color: "normal",
      priority: "medium",
    },
  });

  async function onSubmit(values: TypeAddProjectSchema) {
    console.log(values);

    form.reset();
    startTransition(async () => {
      await AddProject(values).then((data) => {
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
        }
      });
    });
  }
  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Task Title */}
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
                  placeholder="Add Project"
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
                {" "}
                <LoaderCircle className="animate-spin" />{" "}
                <span>Adding Project</span>
              </div>
            ) : (
              "Add Project"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
