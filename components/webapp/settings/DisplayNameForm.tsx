'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {  UpdateUsername } from "@/_actions/user";
import { Profile } from '@/types';

type Props = {
  profile: Profile
}

export default function DisplayNameForm({profile}: Props) {
  const { toast } = useToast();
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Create a FormData object from the form
    const formData = new FormData(e.currentTarget);
    try {
      setPending(true);
      const result = await UpdateUsername(formData); // Pass FormData to AddAvatar
      if(result.error){
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Updated successfully!",
          description: "Your profile has been updated."
        });
      }
    } catch (error) {
      console.error('Something went wrong', error);
      toast({
        title: "Update failed",
        description: "There was an error Updating your profile.",
        variant: "destructive"
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
              <div className="grid gap-2">
                
                <Label htmlFor="display_name">Username</Label>
                <Input id="display_name" name='display_name' placeholder={profile.display_name || 'Enter your username'} />
              </div>
            </div>
      <Button type="submit" disabled={pending}>
        {pending ?  "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
