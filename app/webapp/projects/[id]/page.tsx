import { createClient } from "@/utils/supabase/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ChartNoAxesGantt,
  ChevronDown,
  CircleCheckBig,
  List,
  ListFilterPlus,
  Plus,
  Search,
  Text,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import ProjectTasksSection from "@/components/webapp/projects/id/Project.TasksSection";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import FinishProject from "@/components/webapp/projects/id/FinishProject";
import { SidebarTrigger } from "@/components/ui/sidebar";
type Props = {
  params: string;
};
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const supabase = createClient();

  const { data: project, error: projectError } = await (await supabase)
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projectError || !project) {
    return <p>Project not found</p>;
  }

  const { data: tasks, error: tasksError } = await (await supabase)
    .from("tasks")
    .select("*")
    .eq("project_id", id);

    const checkedTasks = tasks?.filter((task) => task.checked).length;
    const totalTasks = tasks?.length || 1; // Avoid division by zero
   
  return (
    <div className="">
      <div className="p-4 flex gap-4 items-center border-b">
      <SidebarTrigger className="sm:hidden" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {project.title &&
              project.title.charAt(0).toUpperCase() + project.title.slice(1)}
          </h1>

          {/* users */}
          <div className="">
         <FinishProject active={checkedTasks && totalTasks >  checkedTasks  ? true : false}  project_id={project.id} />
          </div>
        </div>
      <ProjectTasksSection tasks={tasks} project_id={project.id}/>
      </div>
    </div>
  );
}




// make it for mobile by using specific render 
// add types to tasks fetch and use search bar