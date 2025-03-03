"use client";
import { Dispatch, SetStateAction, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types";

import { EditTask } from "@/_actions/task";
import { useToast } from "@/hooks/use-toast";
import useSelectTaskStore from "@/lib/store/useTaskStore";
import { EditTaskSchema, TypeEditTaskSchema } from "@/schema/task";

import React, { startTransition, useEffect, useTransition } from "react";
import { priorities } from "@/constants";
import { LoaderCircle } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaFlag } from "react-icons/fa6";

import { DateTimePickerNoPopver } from "@/components/ui/DateTimePicker-rdsx-NoPopover";
import { DateTimePicker } from "@/components/ui/DateTimePicker-rdsx";

import { useIsMobile } from "@/hooks/use-mobile";
type Props = {
  task: Task;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
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

export default function TaskInformationForm({ task, setIsOpen }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();
  const { selectTask } = useSelectTaskStore();
  const { task_id: useSelectTaskStoreId } = useSelectTaskStore();
  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
    return date < today || date > new Date("2050-01-01");
  };
  const timeOptions = generateTimeOptions();
  const task_id = task.id;
  const form = useForm<TypeEditTaskSchema>({
    resolver: zodResolver(EditTaskSchema),
    defaultValues: {
      title: task?.title,
      priority: task?.priority ?? "medium",
      hour: task?.planned_end_date
        ? new Date(task.planned_end_date).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }) // Local time, 24-hour format
        : "",
      day: task?.planned_end_date ? new Date(task.planned_end_date) : undefined,
      description: task?.description || "",
    },
  });
  const isMobile = useIsMobile();
  async function onSubmit(values: TypeEditTaskSchema) {
    startTransition(async () => {
      await EditTask(task_id, values).then((data) => {
        if (data?.error) {
          setError(data?.error.toString());
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          });
        }

        toast({
          title: "Task have been updated!",
          description: data.success,
        });
        selectTask(null);
        setIsOpen && setIsOpen(false);
      });
    });
  }

  return (
    <div>
      {/* title */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-4 mx-auto py-2 "
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
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

          {/* calendar */}
          {isMobile ? (
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <DateTimePickerNoPopver />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
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
          )}

          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? (
              <div className="flex items-center  gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />{" "}
                <span> Updating... </span>
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
