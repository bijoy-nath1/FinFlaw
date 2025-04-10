"use client";

import Link from "next/link";
import React, { SetStateAction } from "react";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomInput from "./CustomInput";
import { AuthFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions/auth";
import { useRouter } from "next/navigation";
import PlaidLink from "./PlaidLink";

function AuthForm({ type }: { type: string }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formSchema = AuthFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    // const userData = {
    //   firstName:values.firstName!,
    //   lastName:values.lastName!,
    //   address1:values.address1!,
    //   city:values.city!,
    //   state:values.state!,
    //   postalCode:values.postalCode!,
    //   dateOfBirth:values.dateOfBirth!,
    //   ssn:values.ssn!,
    //   email:values.email,
    //   password:values.password,


    // }
    try {
      if (type === "sign-up") {
        // console.log('in sign-up on submit');
        const newUser = await signUp(values);
        console.log("authform",newUser)
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await signIn(values);
        // console.log("signin response:", response);
        if (response) router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="mb-12 cursor-pointer items-center gap-2 flex">
          <Image
            src="/icons/logo.svg"
            width={30}
            height={30}
            alt="not found"
            className="mt-2 ml-3"
          />
          <h1 className="text-black text-26 font-ibm-plex-serif font-bold ">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "link your account to get continue "
                : "please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {/* {user ? ( */}
        <div className="flex flex-col gap-4">
          {/** Plain link to link account */}
          <PlaidLink user={user} variant='primary'/>
        </div>
       {/* ) : (  */}
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      Label="First Name"
                      placeholder="enter your name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      Label="Last Name"
                      placeholder="enter your last name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    Label="Address"
                    placeholder="enter your Address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    Label="City"
                    placeholder="enter your city name"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      Label="State"
                      placeholder="enter your state"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      Label="Postal Code"
                      placeholder="enter your postal code"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      Label="Date o Birth"
                      placeholder="enter your Date of Birth"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      Label="SSN"
                      placeholder="enter your SSN"
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name="email"
                Label="Email"
                placeholder="enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                Label="Password"
                placeholder="enter your password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      &nbsp; loading...
                    </>
                  ) : type === "sign-in" ? (
                    "sign-in"
                  ) : (
                    "sign-up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer>
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in" ? (
                <>
                  Don't have an account?{" "}
                  <Link href="/sign-up" className="form-link">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href="/sign-in" className="form-link">
                    Sign In
                  </Link>
                </>
              )}
            </p>
          </footer>
        </>
      {/* )}  */}
    </section>
  );
}

export default AuthForm;
