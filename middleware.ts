import { NextResponse } from "next/server";
import { getLoggedInUser } from "./components/actions/auth";

async function middleware(request) {
  const user = await getLoggedInUser();

  if (user === undefined || user === null) {
    return NextResponse.redirect(new URL("sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/my-banks", "/payment-transfer", "/transaction-history", "/"],
};

export default middleware;
