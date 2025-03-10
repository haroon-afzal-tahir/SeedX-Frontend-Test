import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getSessions } from "@/functions/sessions.api";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessions = await getSessions();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <main className="flex h-[100dvh] w-full">
          <Sidebar sessions={sessions} />
          <div className="flex-1 max-w-3xl flex items-center justify-center flex-col gap-2 mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
