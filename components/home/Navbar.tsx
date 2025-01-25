import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../theme-switcher";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="flex justify-between items-center py-3 border-b ">
      <div className="">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      <div className="flex gap-8 items-center">
        <Link className="" href={"/feature"}>
          Feature
        </Link>
        <Link href={"/sign-in"}>Sign In</Link>

        <Button asChild variant={"outline"}>
          <Link href={"/sign-up"}>Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
