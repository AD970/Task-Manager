'use client'
import { EditTask } from '@/_actions/task';
import { useToast } from '@/hooks/use-toast';
import useSelectTaskStore from '@/lib/store/useTaskStore'
import { EditTaskSchema, TypeEditTaskSchema } from '@/schema/task';
import { Task } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect } from 'next/navigation';
import React, { startTransition, useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form';
import TaskInformationForm from './TaskInformationForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Props = {}

export default function TaskInformation({}: Props) {
  const {task_id} = useSelectTaskStore();
  const [task,setTask] = useState<Task>()
  const [loading,setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
        

    useEffect(() => {
      let isCancelled = false; // Flag to prevent state updates if component unmounts
      const controller = new AbortController(); // AbortController to cancel fetch requests
  
      async function fetchTask() {
        if (!task_id || loading) return; // Prevent multiple fetch requests
  
        setLoading(true);
        setError(null);
  
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
  
        if (userError || !user?.id) {
          redirect('/login');
          return;
        }
  
        const user_id = user.id;
        try {
          const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', task_id)
            .eq('user_id', user_id)
            .single();
  
          if (taskError) throw new Error(taskError.message);
  
          if (!isCancelled) {
            setTask(taskData);
            setError(null);
          }
        } catch (err: any) {
          if (!isCancelled) {
            setError(`Error fetching task: ${err.message}`);
          }
        } finally {
          if (!isCancelled) setLoading(false);
        }
      }
      
      console.log('i have been ran',task_id)
      fetchTask();
  
      return () => {
        isCancelled = true; // Prevents state updates on unmounted components
        controller.abort(); // Cancels any ongoing fetch request
      };

    }, [task_id]);
  
    const {selectTask} = useSelectTaskStore();
    function HandleCloseTask(){
      selectTask(0)
      setTask(undefined)
      }
  return (
    <div className='w-full min-h-screen overflow-y-scroll max-h-screen'>
      <div className="p-4 flex items-center border-b">
        <h1>View Task</h1>
      </div>
      {error ? (
    <div className="text-red-500 text-center p-4">
      <h1>{error}</h1>
    </div>
  ) : loading ? (
    <div className=" py-8 p-4 space-y-6 ">
      <div className="space-y-2">
      <Skeleton className='h-6 w-14' />
      <Skeleton className='h-6 w-full' />
      </div>
      <div className="space-y-2">
      <Skeleton className='h-6 w-14' />
      <Skeleton className='h-20 w-full' />
      </div>
      <div className="space-y-2">
      <Skeleton className='h-6 w-14' />
      <div className="flex gap-4 items-center justify-between ">
        
      <Skeleton className='h-4 w-6 col-span-1 rounded-full' />
      <Skeleton className='h-4 w-8 col-span-1 rounded-full' />
      <Skeleton className='h-4 w-8 col-span-1 rounded-full' />
      </div>

      </div>
      <div className="space-y-2">
        <div className="flex gap-2  ">

        <Skeleton className='h-8 w-8' />
        <Skeleton className='w-full h-8' />
        <Skeleton className='h-8 w-8' />
        </div>
      <Skeleton className='w-full h-48' />
      </div>
    </div>
  ) : task ? (
    
    <div className="">
      <div className="flex w-full items-center p-4 justify-between ">
        <h1>{task.title}</h1>
        <Button variant={'ghost'} onClick={HandleCloseTask} size='icon'><X /></Button>
      </div>
    <TaskInformationForm key={task_id} task={task} /> 
    </div>
  )  :(
  <div className='flex h-[80vh] items-center justify-center'>
    <h1 className='text-muted-foreground'>Please select task</h1>

  </div>
  )}
</div>
  )
}