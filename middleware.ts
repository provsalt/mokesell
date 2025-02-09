import type { NextRequest } from "next/server";
import { setLastLoggedIn } from "@/actions/lastLoggedIn";

export const middleware = async (request: NextRequest) => {
  if (
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/_next")
  )
    return;
  if (request.headers.has("Next-Router-Prefetch")) return;
  await setLastLoggedIn();
};
