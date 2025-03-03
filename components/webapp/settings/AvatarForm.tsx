'use client'
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; 
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsImages, BsPaperclip } from "react-icons/bs";
import { IoSendOutline } from "react-icons/io5";
import * as z from "zod";
import { AddAvatarSchema, TypeAddAvatarSchema } from '@/schema/user';
type Props = {}

export default function AvatarForm({}: Props) {
    
    const [pending,setPending] = useState(false)
    async function HandleSubmit(){

        try{
        setPending(true);
        
        }catch{

        }finally{

        }
    }
  return (
    <form onSubmit={HandleSubmit}>
        
    </form>
  )
}