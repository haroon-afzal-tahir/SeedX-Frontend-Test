"use client";

import { Message } from "@/components/Message";
import { useSessions } from "@/context/sessions.context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { useEventSource } from "@/hooks/useEventSource"; // Import the custom hook

export default function Chat() {
  const { id } = useParams();
  const { getSession, addMessage, updateMessage } = useSessions();
  const router = useRouter();
  const [assistantContext, setAssistantContext] = useState({
    messageId: "",
    content: "",
  });
  const [eventSourceUrl, setEventSourceUrl] = useState<string | null>(null);

  const session = getSession(id as string);

  useEffect(() => {
    if (!session || session.messages.length === 0) {
      router.push("/");
    }
  }, [session, router]);

  function addAssistantMessage() {
    const assistantMessageId = crypto.randomUUID();
    setAssistantContext({ messageId: assistantMessageId, content: "" });
    addMessage(id as string, {
      id: assistantMessageId,
      createdAt: new Date(),
      content: "",
      isUser: false,
    });
  }

  function updateAssistantContext(content: string) {
    setAssistantContext({ messageId: assistantContext.messageId, content });
    updateMessage(id as string, {
      id: assistantContext.messageId,
      createdAt: new Date(),
      content: `${assistantContext.content}${content}`,
      isUser: false,
    });
  }


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;

    // user message
    addMessage(id as string, {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      content: message,
      isUser: true,
    });


    // assistant message
    let assistantMessageId = crypto.randomUUID();

    setAssistantContext({ messageId: assistantMessageId, content: "" });

    addMessage(id as string, {
      id: assistantMessageId,
      createdAt: new Date(),
      content: "",
      isUser: false,
    });

    const urlParams = new URLSearchParams({
      session_id: id as string,
      query: message,
    });
    const apiUrl = `api/query?${urlParams.toString()}`;

    // Set the URL for EventSource
    setEventSourceUrl(apiUrl);
  }

  useEffect(() => {
    // Initial API call to fetch the system response if there's only one message
    if (session && session.messages.length === 1) {
      const urlParams = new URLSearchParams({
        session_id: id as string,
        query: session.messages[0].content,
      });
      const apiUrl = `api/query?${urlParams.toString()}`;
      addAssistantMessage();
      setEventSourceUrl(apiUrl);
    }
  }, [id, session]);

  // Use the custom hook to handle EventSource
  useEventSource(eventSourceUrl, (message) => {
    if (message.event === "chunk") {
      console.log({
        messageId: assistantContext.messageId,
        content: `${assistantContext.content}${message.data}`,
      });
      updateAssistantContext(message.data);
    }
  });

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
  );
}
