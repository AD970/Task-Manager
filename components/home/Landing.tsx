import React from "react";
import { Button, buttonVariants } from "../ui/button";
import "./styles.css";
import Link from "next/link";
import { cn } from "@/lib/utils";
type Props = {};

export default function Landing({}: Props) {
  return (
    <div className="min-h-[80vh] relative w-full flex items-center justify-center">
      <div className="text-center  pt-4 max-w-3xl">
        <h1 className="font-bold  text-5xl ">Stay Organized, Stay Creative</h1>
        <p className="text-2xl mt-16  dark:text-gray-400 text-gray-700 ">
          Join millions of people to capture ideas, organize life, and do
          something creative.
        </p>
        <Link href={'/login'}  className={cn("mt-6 px-16",buttonVariants({variant: 'outline',size: 'wide'}))}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
