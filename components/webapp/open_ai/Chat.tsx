"use client";
import { TypeAddPromptSchema, AddPromptSchema } from "@/schema/open_ai";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // ✅ Import Button
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { getChatGPTResponse } from "@/_actions/open_ai";

export default function Chat() {
  const form = useForm<TypeAddPromptSchema>({
    resolver: zodResolver(AddPromptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [chatResponse, setChatResponse] = useState("");

  async function onSubmit(data: TypeAddPromptSchema) {
    form.reset();

    startTransition(async () => {
      const response = await getChatGPTResponse(data.prompt);
      setChatResponse(response); // ✅ Store response in state
      console.log(response);
    });
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Input placeholder="Add tasks ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Generating..." : "Submit"}
          </Button>
        </form>
      </Form>

      {/* ✅ Display ChatGPT Response */}
      {chatResponse && (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
          <h3 className="text-lg font-semibold">AI Response:</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {chatResponse}
          </p>
        </div>
      )}
    </div>
  );
}
