import type { Metadata } from "next";
import "./globals.css";
import {Navbar} from "@/components/Navbar/Navbar";
import {UserProvider} from "@/providers/UserProvider";

export const metadata: Metadata = {
  title: "Mokesell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-50"
      >
         <UserProvider>
           <Navbar/>
           <main>
             {children}
           </main>
         </UserProvider>
      </body>
    </html>
  );
}
