"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import { Input } from "@/components/ui/input";
import {
  Plus,
  ChevronDown,
  CalendarDays,
  ChevronRight,
  Flag,
} from "lucide-react";
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
type Props = {
  setLoadingTask: Dispatch<SetStateAction<string>>;
};

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(time);
    }
  }
  return times;
};
export default function TaskForm({ setLoadingTask }: Props) {
  const [isPending, startTransition] = useTransition();
  const [descriptionCollapsible, setDescriptionCollapsible] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();
  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    return date < today || date > new Date("2050-01-01");
  };

  const form = useForm<TypeAddTaskSchema>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      hour: "23:59",
      day: new Date(),
      description: "",
    },
  });
  async function onSubmit(values: TypeAddTaskSchema) {
    form.reset();
    setLoadingTask(values.title);
    startTransition(async () => {
      await AddTask(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
          setLoadingTask("");
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }
        setLoadingTask("");
      });
    });
  }

  const timeOptions = generateTimeOptions();
  return (
    <div className="p-4">
      <Form {...form}>
        <form className="px-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="relative">
            {/* Plus Icon */}
            <div className="absolute left-2.5 top-3 h-4 pointer-events-none w-4 text-muted-foreground">
              <Plus className="h-4 w-4" />
            </div>

            {/* Task Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="w-full rounded-lg bg-background pl-8"
                      placeholder="Add task"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Task Priority */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="absolute right-2.5 top-3 h-4 w-4 text-muted-foreground">
                  <ChevronDown className="h-4 w-4 hover:text-primary duration-300 cursor-pointer" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Priority</h4>
                    <p className="text-muted-foreground text-sm">
                      Set the priority for your task
                    </p>
                  </div>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
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

                  {/* Description input section */}
                  <Collapsible
                    open={descriptionCollapsible}
                    onOpenChange={setDescriptionCollapsible}
                    className="mt-4"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground text-sm">
                        Description
                      </p>
                      <CollapsibleTrigger asChild>
                        <Button variant={"ghost"} size={"sm"}>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 text-muted-foreground duration-300",
                              descriptionCollapsible ? "rotate-90 " : "",
                            )}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="w-full rounded-lg bg-background min-h-24 "
                                placeholder="Description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </PopoverContent>
            </Popover>

            {/* Task Date */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="absolute right-8 top-3 h-4 w-4 text-muted-foreground">
                  <CalendarDays className="h-4 w-4 cursor-pointer hover:text-primary duration-300" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={isDisabled}
                        />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center  justify-between">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormControl>
                          <Input {...field} type="time" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </PopoverContent>
            </Popover>

            {/* Task Time */}
          </div>

          {/* Submit Button */}
        </form>
      </Form>
    </div>
  );
}
