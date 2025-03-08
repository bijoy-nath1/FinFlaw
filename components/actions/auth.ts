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
  listSessions: () => Promise<{ sessions: any[] }>;
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
    console.log('account:', account);

    const newUserAccount: NewUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    console.log('newUserAccount:', newUserAccount);
    const session: Session = await account.createEmailPasswordSession(
      email,
      password
    );
    console.log('session:', session);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return {newUserAccount};
  } catch (error) {
    console.log(error);
    // return error;
  }
}

export const signIn = async (formData: FormData): Promise<Session | void> => {
  const email = formData.email;
  const password = formData.password;

  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);
  // console.log(response);
  // const session = (await cookies()).get("appwrite-session");
  (await cookies()).set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  console.log('signed-in session:', session);
  const cookie = (await cookies()).get("appwrite-session");
    console.log(cookie);
  return session;
};
// there is problem in my getLoggedInUser server function
export const getLoggedInUser = async (): Promise<NewUserAccount | void> => {
  try {
    const { account }: SessionClient = await createSessionClient();

    const user: NewUserAccount = await account.get();
    console.log("Fetched User:", user);

    return parseStringify(user);
  } catch (error) {
    // console.log("Error fetching logged-in user:", error);
    return null;
  }
};
// and also there is problem in my logOut server function
export const logOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete("appwrite-session");
    await account.deleteSession("current");

    // console.log(result);
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};
