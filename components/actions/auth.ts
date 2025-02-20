"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "@/lib/utils";

interface FormData {
  password: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface NewUserAccount {
  $id: string | undefined;
  email: string | undefined;
  name: string | undefined;
}

interface Session {
  secret: string;
}

interface Account {
  create: (
    id: string,
    email: string,
    password: string,
    name: string
  ) => Promise<NewUserAccount>;
  createEmailPasswordSession: (
    email: string,
    password: string
  ) => Promise<Session>;
  get: () => Promise<NewUserAccount>;
}

interface AdminClient {
  account: Account;
}

interface SessionClient {
  account: Account;
}

export async function signUp(
  formData: FormData
): Promise<{ newUserAccount: NewUserAccount } | void> {
  const email = formData.email;
  const password = formData.password;
  const name = `${formData.firstName} ${formData.lastName}`;
  try {
    const { account }: AdminClient = await createAdminClient();

    const newUserAccount: NewUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    const session: Session = await account.createEmailPasswordSession(
      email,
      password
    );

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.log(error);
  }
}

export const signIn = async (formData: FormData): Promise<Session | void> => {
  const email = formData.email;
  const password = formData.password;

  const { account } = await createAdminClient();
  const response = await account.createEmailPasswordSession(email, password);
  return parseStringify(response);
};

export const getLoggedInUser = async (): Promise<NewUserAccount | void> => {
  try {
    const { account }: SessionClient = await createSessionClient();
    const user: NewUserAccount = await account.get();
    return user ? parseStringify(user) : null;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
