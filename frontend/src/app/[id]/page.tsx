"use client";

import { Message } from "@/components/Message";
import { useSessions } from "@/context/sessions.context";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PiPaperPlaneRightFill } from "react-icons/pi";

export default function Chat() {
  const { id } = useParams();
  const { getSession, addMessage } = useSessions();
  const router = useRouter();

  const session = getSession(id as string);

  if (!session || session.messages.length === 0) {
    router.push("/");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    addMessage(id as string, {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      content: message,
      isUser: true, 
    });

    fetch(`/api/query/${id}`, {
      method: "POST",
      body: JSON.stringify({ message })
    }).then((res) => res.json()).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    if (session && session.messages.length) {
      fetch(`/api/query`, {
        method: "POST",
        body: JSON.stringify({ id, message: session.messages[session.messages.length - 1].content })
      }).then((res) => res.json()).then((data) => {
        console.log(data);
      });
    }
  }, [session, id]);

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <div className="flex flex-col gap-4 h-full overflow-y-auto overflow-x-hidden">
        {session?.messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-sidebar rounded-lg w-full relative p-4">
        <input type="text" name="message" placeholder="Write your message..." autoComplete="off" className="w-full rounded-md outline-0 pr-12" autoFocus />

        <button type="submit" className="bg-foreground p-3 rounded-md absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
          <PiPaperPlaneRightFill className="text-background" />
        </button>
      </form>
    </div>
  )
}
