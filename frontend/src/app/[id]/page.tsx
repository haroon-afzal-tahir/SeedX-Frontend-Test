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
    toolOutput: [] as ToolOutput[],
  });
  const [eventSourceUrl, setEventSourceUrl] = useState<string | null>(null);
  const processingRef = useRef(false); // Add this to prevent duplicate calls
  const [isInitialized, setIsInitialized] = useState(false);

  const session = getSession(id as string);

  useEffect(() => {
    if (!session || session.messages.length === 0) {
      setEventSourceUrl(null); // Clear the EventSource URL before navigation
      router.push("/");
    }
  }, [session, router]);

  function addAssistantMessage() {
    const assistantMessageId = crypto.randomUUID();
    setAssistantContext({ messageId: assistantMessageId, content: "", toolOutput: [] });
    addMessage(id as string, {
      id: assistantMessageId,
      createdAt: new Date(),
      content: "",
      isUser: false,
      toolOutput: [],
    });
  }

  function updateAssistantContext(content: string, toolOutput?: ToolOutput) {
    if (content.length === 0) return;

    setAssistantContext((prev) => {
      if (toolOutput) {
        console.log({
          messageId: prev.messageId,
          content: prev.content + content,
          toolOutput: toolOutput
        })
      }
      return {
        messageId: prev.messageId,
        content: prev.content + content,
        toolOutput: [...prev.toolOutput, toolOutput || {} as ToolOutput]
      }
    });

    if (toolOutput) {
      console.log({
        id: assistantContext.messageId,
        createdAt: new Date(),
        content: content,
        isUser: false,
        toolOutput: [...assistantContext.toolOutput, toolOutput || {} as ToolOutput]
      })
    }

    updateMessage(id as string, {
      id: assistantContext.messageId,
      createdAt: new Date(),
      content: content,
      isUser: false,
      toolOutput: [...assistantContext.toolOutput, ...[toolOutput || {} as ToolOutput]]
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (processingRef.current) return;

    setEventSourceUrl(null);

    processingRef.current = true;

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    (e.target as HTMLFormElement).reset(); // Clear the form

    // user message
    addMessage(id as string, {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      content: message,
      isUser: true,
      toolOutput: [],
    });

    // assistant message
    addAssistantMessage();

    const urlParams = new URLSearchParams({
      session_id: id as string,
      query: message,
    });
    setEventSourceUrl(`api/query?${urlParams.toString()}`);
  }

  useEffect(() => {
    if (
      !isInitialized &&
      session?.messages.length === 1 &&
      !processingRef.current
    ) {
      setIsInitialized(true);
      processingRef.current = true;
      const urlParams = new URLSearchParams({
        session_id: id as string,
        query: session.messages[0].content,
      });
      addAssistantMessage();
      setEventSourceUrl(`api/query?${urlParams.toString()}`);
    }
  }, [isInitialized, session, id, addAssistantMessage]);

  // Using the custom hook to handle EventSource
  useEventSource(eventSourceUrl, (message) => {
    if (message.event === "chunk") {
      updateAssistantContext(message.data);
    } else if (message.event === "tool_output") {
      const { name, output } = JSON.parse(message.data);
      console.log({ name, output })
      updateAssistantContext("", {
        type: name as ToolOutputType,
        data: output as string
      });
    } else if (message.event === "end") {
      processingRef.current = false;
      setEventSourceUrl(null);
    } else if (message.event === "error") {
      setEventSourceUrl(null);
      processingRef.current = false;
    }
  });

  return (
    <div className="flex flex-col gap-4 p-4 w-full h-full">
      <div className="flex flex-col gap-4 h-full overflow-y-auto overflow-x-hidden">
        {session?.messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isComplete={!processingRef.current}
            assistantMessageId={assistantContext.messageId}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-sidebar rounded-lg w-full relative p-4">
        <input type="text" name="message" placeholder="Write your message..." autoComplete="off" className="w-full rounded-md outline-0 pr-12" autoFocus />

        <button type="submit" disabled={processingRef.current} className="bg-foreground p-3 rounded-md absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
          <PiPaperPlaneRightFill className="text-background" />
        </button>
      </form>
    </div>
  );
}
