"use client";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { FaFlag } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

import { Textarea } from "@/components/ui/textarea";
import { AddTask } from "@/_actions/task";
import { useToast } from "@/hooks/use-toast";
import { priorities } from "@/constants";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/DateTimePicker-rdsx";

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

const timeOptions = generateTimeOptions();

export default function AddTaskModal({ project_id }: { project_id: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const { toast } = useToast();

  const form = useForm<TypeAddTaskSchema>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      title: "",
      priority: "medium",
      hour: "23:59",
      day: new Date(),
      description: "",
      project: project_id,
    },
  });

  async function onSubmit(values: TypeAddTaskSchema) {
    form.reset();
    startTransition(async () => {
      await AddTask(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
          toast({
            title: "Uh oh! Something went wrong.",
            description: data.error,
          });
        }
      });
    });
  }

  return (
    <div>
      <Form {...form}>
        <form className="px-8 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Task Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Add task"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Task Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    className="flex gap-4"
                    onValueChange={field.onChange}
                  >
                    {priorities.map((priority) => (
                      <div
                        key={priority.value}
                        className="flex space-x-2 items-center"
                      >
                        <RadioGroupItem value={priority.value} />
                        <FaFlag className={cn(priority.color)} />
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
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

          {/* Task Date */}
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

          {/* Task Time */}

          {/* Submit Button */}
          <Button type="submit" className="mt-4" disabled={isPending}>
            {isPending ? "Adding..." : "Add Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
