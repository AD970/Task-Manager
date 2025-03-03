"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Github,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { signOutAction } from "@/_actions/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Props = {
  profile: Profile;
};
export function NavUser({ profile }: Props) {
  const { isMobile } = useSidebar();
  const [pending,setPending] = useState(false)
  const {toast} = useToast();
  async function HandleSubmit(){

    try {
      setPending(true)
      await signOutAction();
    } catch (error) {
    console.log(error)      
      toast({
        title: 'Something went wrong!',
        variant: 'destructive'
      })
  }finally{
      setPending(false)
    
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={profile?.avatar_url || "placeholder"}
                  alt={"avatar"}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {profile.display_name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile.avatar_url || "placeholder"}
                    alt={"placeholder"}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile.display_name}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex cursor-pointer gap-2 items-center">
                <Sparkles  />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link className="flex gap-2 items-center" href='settings'>
                <BadgeCheck className="" />
                Account
                </Link>
              </DropdownMenuItem>
              <Link className="cursor-pointer" href={'/github.com/AD970'}>
              <DropdownMenuItem className=" cursor-pointer flex gap-2 items-center">
                <Github />
                My Github Account
              </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="flex cursor-pointer gap-2 items-center">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Button onClick={HandleSubmit} type="submit" >

<LogOut />
Log out
</Button>
              {/* <Dialog>
                <DialogTrigger asChild>
                </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Logout
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you want to logout?
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>

                  <div className="flex items-center justify-end gap-4">
                    <DialogClose asChild>
                      <Button type="button">Close</Button>
                    </DialogClose>
                    <Button  variant={'destructive'}>Logout</Button>
                  </div>
                  
                    </DialogFooter>
                  </DialogContent>
              </Dialog> */}
       
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}