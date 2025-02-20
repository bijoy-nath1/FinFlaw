import AuthForm from "@/components/AuthForm";
import React from "react";
import { getLoggedInUser } from "@/components/actions/auth";

async function signUp() {
  // const newUser = await getLoggedInUser();
  // console.log(newUser);
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthForm type="sign-up" />
    </section>
  );
}

export default signUp;
