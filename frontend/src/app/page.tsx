"use client";

import { useSessions } from "@/context/sessions.context";
import { useRouter } from "next/navigation";
import { PiPaperPlaneRightFill } from "react-icons/pi";

export default function Home() {
  const router = useRouter();
  const { sessions, addSession } = useSessions();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    
    const uuid = crypto.randomUUID();

    addSession({ 
      id: uuid,
      name: `Session ${sessions.length + 1}`,
      createdAt: new Date(),
      messages: [
        {
          id: crypto.randomUUID(),
          content: message,
          createdAt: new Date(),
          isUser: true,
        }
      ]
    });

    router.push(`/${uuid}`, { scroll: true });

    // reset the form
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">What would you like to do?</h1>
      
      <form onSubmit={handleSubmit} className="bg-sidebar rounded-lg w-full relative p-4">
        <input type="text" name="message" placeholder="Write your message..." autoComplete="off" className="w-full rounded-md outline-0 pr-12" autoFocus />
        
        <button type="submit" className="bg-foreground p-3 rounded-md absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
          <PiPaperPlaneRightFill className="text-background" />
        </button>
      </form>
    </div>
  );
}
