import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg outline-1 outline-black/5 p-6 bg-white h-125", className)}>
      {children}
    </div>
  );
}