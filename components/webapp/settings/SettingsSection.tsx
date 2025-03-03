"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Profile } from "@/types";

import { ThemeToggle } from "@/components/theme-toggle";
import { quotes } from "@/data/quotes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AvatarForm from "./AvatarForm";
import DisplayNameForm from "./DisplayNameForm";
type Props = {
  profile: Profile;
};

type Quote = {
  quote: string;
  author: string;
};

export default function SettingsSection({ profile }: Props) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    function getRandomQuote() {
      const i = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[i];
      setQuote(randomQuote);
    }
    getRandomQuote();
  }, []);

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt="Avatar"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Avatar</DialogTitle>
                  </DialogHeader>
                  <AvatarForm setOpen={setOpen} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-semibold">{profile.display_name}</h3>
              <p className="text-sm text-muted-foreground">
                {quote && quote.quote}
              </p>
            </div>
          </div>

          <Separator />
          {/* User Info Form */}
          <DisplayNameForm profile={profile} />

          <Separator />

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferences</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle dark mode on or off
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
