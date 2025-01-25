"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CircleCheckBig,
  CalendarCheck,
  Settings2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Profile } from "@/types";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/webapp/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "My Tasks",
      url: "/webapp/tasks",
      icon: CircleCheckBig,
    },
    {
      title: "Calendar",
      url: "/webapp/calendar",
      icon: CalendarCheck,
    },
    {
      title: "Settings",
      url: "/webapp/settings",
      icon: Settings2,
    },
  ],
};
export function AppSidebar({
  profile,
  ...props
}: React.ComponentProps<typeof Sidebar> & { profile: Profile }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser profile={profile} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
