"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TypeLoginSchema, TypeSignupSchema } from "@/schema/index";

export const signupAction = async (values: TypeSignupSchema) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  console.log("data :", values);

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        display_name: values.display_name,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {error: error.message}
  } else {
    return redirect("/webapp/dashboard");
  }
};

export const loginAction = async (values: TypeLoginSchema) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    console.error(error.code + " " + error.message);

    return {error: error.message}
  }

  return redirect("/webapp/dashboard");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
