import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { SESSIONS } from "@/constants/sidebar.data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SeedX - Chat",
  description: "Chat Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full`}
      >
        <main className="flex h-[100dvh] w-full">
          <Sidebar sessions={SESSIONS.sessions} />
          <div className="flex-1 max-w-3xl flex items-center justify-center flex-col gap-2 mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
