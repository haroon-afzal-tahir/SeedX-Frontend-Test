"use client";

import Link from "next/link"
import { useSessions } from "@/context/sessions.context";

export const Sidebar = () => {
  const { sessions } = useSessions();
  return (
    <div className="bg-sidebar h-full w-64 p-4 flex flex-col gap-2">
      <Link href="/" className="p-2 rounded-md hover:bg-background w-full text-sm text-center">SuperCar Assistant</Link>
      {sessions.length > 0 && (
        <>
          <hr className="my-2" />
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <Link key={session.id} href={`/${session.id}`} className="p-2 rounded-md hover:bg-background w-full text-sm truncate">
                {session.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
