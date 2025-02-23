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

  return (
    <div className="">
      <div className="p-4 border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="webapp/projects">Projects</BreadcrumbLink>
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
            <Button>
              <UserPlus />
              Invite
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Tabs defaultValue="list" className="flex flex-col w-full">
            <div className="flex  border-b py-4 justify-between items-center w-full">
              <TabsList>
                <TabsTrigger
                  value="timeline"
                  className="flex gap-2  items-center"
                >
                  <ChartNoAxesGantt className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger className="flex gap-2  items-center" value="list">
                  {" "}
                  <List className="h-4 w-4" /> List
                </TabsTrigger>
              </TabsList>
              <div className="">
                <TabsContent value="list">
                  <div className="relative">
                    {/* Plus Icon */}
                    <div className="absolute left-2.5 top-3 h-4 pointer-events-none w-4 text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        className="w-full rounded-lg bg-background pl-8"
                        placeholder="Search..."
                      />
                      <Button className="">
                        <Plus />
                        New Task
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>

              <TabsContent value="timeline">
                Change your password here.
              </TabsContent>
            </div>
            <TabsContent value="list">
              <TasksSection tasks={tasks && tasks} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function TasksSection({ tasks }: { tasks: Task[] | null }) {
  return (
    <div>
      <Table>
        <TableCaption>Tasks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <ChevronDown className="h-4 w-4" />{" "}
            </TableHead>
            <TableHead>
              {" "}
              <div className="flex items-center gap-2">
                <CircleCheckBig className="h-4 w-4" /> Task
              </div>
            </TableHead>
            <TableHead>
              {" "}
              <div className="flex items-center gap-2">
                <Text className="h-4 w-4" /> Description
              </div>
            </TableHead>
            <TableHead>
              {" "}
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Estimation
              </div>
            </TableHead>
            <TableHead>
              {" "}
              <div className="flex items-center gap-2">
                <ListFilterPlus className="h-4 w-4" /> Priority
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks?.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description || "-"}</TableCell>
              <TableCell>{task.planned_end_date}</TableCell>
              <TableCell>
                {task.priority &&
                  task?.priority?.charAt(0).toUpperCase() +
                    task?.priority?.slice(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
