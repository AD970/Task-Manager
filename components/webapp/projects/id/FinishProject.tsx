"use client";
import { CompleteProject } from "@/_actions/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

type Props = {
  project_id: string;
  active: boolean;
};

export default function FinishProject({ project_id, active }: Props) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();
  async function HandleSubmit() {
    try {
      setPending(true);
      const result = await CompleteProject(project_id);

      if (result.success) {
        toast({
          title: result.success,
        });
      }
      if (result?.error) {
        toast({
          title: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setPending(false);
      redirect("/webapp/projects");
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={active}>Finish Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Completing this project will mark it
            as finished. If you prefer to skip this confirmation in the future,
            you can enable 'Skip Warning' in your{" "}
            <Link href={"/settings"} className=" underline">
              settings
            </Link>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full flex justify-end items-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending} onClick={HandleSubmit}>
              {pending ? (
                <div className="flex gap-1 items-center">
                  <Loader2 className="animate-spin " />
                  <span>Confirming...</span>
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
