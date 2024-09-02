import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RideHub",
  description: "Book your next ride with us",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <ClerkProvider>
        <html lang="en">
          <body
            className={cn(
              "min-h-80 font-sans antialiased",
              inter.className,
            )}
          >
            {/* <Navbar /> */}
            <Toaster />
            {children}
          </body>
        </html>
      </ClerkProvider>
    </Providers>
  );
}
