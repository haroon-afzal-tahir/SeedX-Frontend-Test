import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { SessionsProvider } from "@/context/sessions.context";
import { ClientLayout } from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeedX",
  description: "SuperCar Virtual Sales Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionsProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
        >
          <main className="flex md:flex-row flex-col h-[100dvh] w-full overflow-hidden">   
            <ClientLayout />
            {children}
          </main>
        </body>
      </html>
    </SessionsProvider>
  );
}
