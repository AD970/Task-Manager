

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Bell, MoreVertical, Share2} from "lucide-react";
import React from "react";

type Props = {};





async function Hero(){


  return(
    <main className="grid gap-4 grid-cols-12 p-4">
      
      <div className="md:col-span-4">
        <Card>
          <CardHeader className="flex  items-center">
              Overall Information
              a
            <div className="flex gap-2">
              <Share2 />
              <MoreVertical />
            </div>
          </CardHeader>
        </Card>
      </div>

    </main>

  )
}



export default async function page({}: Props) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
    return <div>Error</div>;
  }
  const user_id = user?.id;
  if (!user_id) {
    console.error("No user id");
    return <div>No User Id!</div>;
  }
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();

  return (
    <div className="flex flex-col  min-h-screen">
      <div className="flex items-center px-4 py-3 justify-between ">
        <div className="flex gap-4 items-center ">
          <SidebarTrigger />
          <h1 className="text-2xl  font-black ">
            Hi, {profile?.display_name}!
          </h1>
        </div>
        <div className="flex items-center gap-4">

        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>
        </div>
        </div>
      </div>
      <Separator />
      <Hero />
    </div>
  );
}
