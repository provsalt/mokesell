import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { UserProvider } from "@/providers/UserProvider";
import { Toaster } from "@/components/ui/toaster";
import { Footer } from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Mokesell",
};

export const revalidate = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <div className="sticky top-0 z-40 dark:bg-gray-950 dark:text-gray-50 bg-gray-50 text-gray-950 drop-shadow-md">
              <Navbar />
            </div>
            <main className="flex flex-1 flex-col dark:bg-gray-950 dark:text-gray-50 bg-gray-50 text-gray-950 ">
              {children}
            </main>
            <Toaster />
          </div>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
