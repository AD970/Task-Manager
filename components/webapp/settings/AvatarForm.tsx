"use client";
import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AddAvatar } from "@/_actions/user";

type Props = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AvatarForm({ setOpen }: Props) {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Create a FormData object from the form
    const formData = new FormData(e.currentTarget);
    try {
      setPending(true);
      const result = await AddAvatar(formData); // Pass FormData to AddAvatar
      if (result.error) {
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload successful",
          description: "Your profile picture has been updated.",
        });
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture",
        variant: "destructive",
      });
    } finally {
      setPending(false);
      setOpen(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Image</Label>
      <Input name="avatar" type="file" accept="image/*" />
      <Button type="submit" disabled={pending}>
        {pending ? "Uploading..." : "Submit"}
      </Button>
    </form>
  );
}
