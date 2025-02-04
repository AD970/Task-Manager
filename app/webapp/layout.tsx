import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { AppSidebar } from "@/components/webapp/sidebar/WebApp-Sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const user_id = user?.id;

  if (!user_id) {
    redirect("/login");
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();
  if (profileError) {
    console.error(profileError);
    return <div>Error loading profile</div>;
  }
  return (
    <main className="bg-background text-foreground ">
      <ToastProvider>
        <SidebarProvider>
          <AppSidebar profile={profileData} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
        <Toaster />
      </ToastProvider>
    </main>
  );
}
