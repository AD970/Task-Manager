import Landing from "@/components/home/Landing";
import Navbar from "@/components/home/Navbar";
import React from "react";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground md:mx-8 lg:mx-10">
      <Navbar />
      <Landing />
    </div>
  );
}
