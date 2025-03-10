"use client";

import { Message } from "@/components/Message";
import { useSessions } from "@/context/sessions.context";
import { useParams, useRouter } from "next/navigation";

export default function Chat() {
  const { id } = useParams();
  const session = useSessions().getSession(id as string);
  const router = useRouter();

  if (!session || session.messages.length === 0) {
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      {session?.messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  )
}
