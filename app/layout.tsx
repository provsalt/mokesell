import type { Metadata } from "next";
import "./globals.css";
import {Navbar} from "@/components/Navbar/Navbar";

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
        <Navbar isLoggedIn={true}/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
