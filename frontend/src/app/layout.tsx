import type { Metadata } from "next";
import "./globals.css";
import { SessionsProvider } from "@/context/sessions.context";
import { MenuLayout } from "@/components/MenuLayout";

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
        <body className="antialiased h-full w-full">
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
