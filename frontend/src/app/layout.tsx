import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionsProvider } from "@/context/sessions.context";
import { MenuLayout } from "@/components/MenuLayout";

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
            <MenuLayout />
            <div className="md:max-w-3xl mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </body>
      </html>
    </SessionsProvider>
  );
}
