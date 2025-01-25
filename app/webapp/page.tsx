import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export default async function page({}: Props) {
  await redirect("/webapp/dashboard");
  return <div>page</div>;
}
