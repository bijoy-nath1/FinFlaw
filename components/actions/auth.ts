"use server";

import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "@/lib/utils";
import {CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products} from 'plaid'
import { Languages } from "lucide-react";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla";

const {APPWRITE_DATABASE_ID:DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID:USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID:BANK_COLLECTION_ID
} = process.env;

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
{password,...userData}:SignUpParams
): Promise<{ newUserAccount: NewUserAccount } | void> {

  let newUserAccount;
  const email = userData.email;
 
  const name = `${userData.firstName} ${userData.lastName}`;
  try {
    const { account,database }: AdminClient = await createAdminClient();
    // console.log('account:', account);

     newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    // console.log('newUserAccount:', newUserAccount);
    if (!newUserAccount) throw new Error("Error creating user");
    // console.log(userData)
    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating dwolla customer");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerUrl,
        dwollaCustomerId,
      }
    );

    const session: Session = await account.createEmailPasswordSession(
      email,
      password
    );
    // console.log('session:', session);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    console.log("databse user",newUser)

    return parseStringify(newUser);
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
  // console.log('signed-in session:', session);
  const cookie = (await cookies()).get("appwrite-session");
    // console.log(cookie);
  return session;
};
// there is problem in my getLoggedInUser server function
export const getLoggedInUser = async (): Promise<NewUserAccount | void> => {
  try {
    const { account }: SessionClient = await createSessionClient();

    const user: NewUserAccount = await account.get();
    // console.log("Fetched User:", user);

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

//creating Link Token

export const createLinkToken = async(user:User)=>{
try{
const tokenParams = {
  user:{
    client_user_id:user.$id
  },
  client_name:`${user.firstName} ${user.lastName}`,
  products:['auth'] as Products[],
  language:'en',
  country_codes:['US'] as CountryCode[],
}

const response = await plaidClient.linkTokenCreate(tokenParams)
return parseStringify({linkToken:response.data.link_token})
}catch(error){

}
}

export const createBankAccount = async ({
  accessToken,
  userId,
  accountId,
  bankId,
  fundingSourceUrl,
  sharableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        accessToken,
        userId,
        accountId,
        bankId,
        fundingSourceUrl,
        sharableId,
      }
    );

    return parseStringify(bankAccount);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
};

// creating Exchange Public token 

export const exchangePublicToken = async({publicToken,user}:exchangePublicTokenProps)=>{
try{
const response = await plaidClient.itemPublicTokenExchange({
  public_token:publicToken
});
const accessToken = response.data.access_token
const itemId = response.data.item_id
// get the account information from Plaid using the acces token 
const accountsResponse = await plaidClient.accountsGet({
  access_token:accessToken
})
const accountData = accountsResponse.data.accounts[0]

//create a processor token for dwolla using accesss token and account id 
const request:ProcessorTokenCreateRequest = {
  access_token:accessToken,
  account_id:accountData.account_id,
  processor:"dwolla" as ProcessorTokenCreateRequestProcessorEnum
}

const processorTokenResponse = await plaidClient.processorTokenCreate(request);
const processorToken = processorTokenResponse.data.processor_token

// create a funding source URL for the account using the Dwolla customer ID,processor token
//  and bank name 

const fundingSourceUrl = await addFundingSource({
  dwollaCustomerId:user.dwollaCustomerId,
  processorToken,
  bankName:accountData.name
})
if(!fundingSourceUrl) throw Error;

await createBankAccount({
  userId:user.$id,
  bankId:itemId,
  accountId:accountData.account_id,
  accessToken,
  fundingSourceUrl,
  sharableId:encryptId(accountData.account_id)
})

revalidatePath("/")
return parseStringify({
  publicTokenExchange:'complete'
})
}catch(error){
console.log(error)
}
}
