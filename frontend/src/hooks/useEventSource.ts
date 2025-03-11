/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export function useEventSource(
  url: string | null,
  onMessage: (data: any) => void
) {
  function closeEventSource(es: EventSource) {
    if (es.readyState === EventSource.OPEN) {
      es.close();
    }
  }
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let requestUrl = "";
    if (!url) return;
    if (!url.startsWith("http") && !url.includes("api/")) {
      requestUrl = process.env.NEXT_PUBLIC_API_URL!;
      requestUrl = requestUrl.endsWith("/") ? requestUrl : `${requestUrl}/`;
      requestUrl += url.startsWith("/") ? url.slice(1) : url;
    } else {
      requestUrl = url;
    }

    const eventSource = new EventSource(requestUrl);
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("message", (event: MessageEvent) => {
      console.log("Received event: ", event.data);
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Failed to parse event data:", error);
      }
    });

    eventSource.addEventListener("error", (event: Event) => {
      console.error("EventSource error:", event);
      eventSource.close();
      eventSourceRef.current = null;
    });

    // Simplified cleanup function
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [url, onMessage]);

  return eventSourceRef.current;
}
