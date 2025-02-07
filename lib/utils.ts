import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const location =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://" + (process.env.VERCEL_BRANCH_URL ?? "");
