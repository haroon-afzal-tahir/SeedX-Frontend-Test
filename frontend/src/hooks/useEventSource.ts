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
    try {
      // Create new EventSource instance
      const eventSource = new EventSource(requestUrl);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event: MessageEvent) => {
        console.log("Received event: ", event.data);
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Failed to parse event data:", error);
        }
      };

      eventSource.onerror = (event: Event) => {
        console.error("EventSource error:", event);
        if (eventSourceRef.current) {
          closeEventSource(eventSourceRef.current);
          closeEventSource(eventSource);
          eventSourceRef.current = null;
        }
      };

      eventSource.onopen = (event: Event) => {
        console.log("EventSource connection opened:", event);
      };

      // Cleanup function
      return () => {
        if (eventSourceRef.current) {
          closeEventSource(eventSourceRef.current);
          closeEventSource(eventSource);
          eventSourceRef.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to create EventSource:", error);
      return undefined;
    }
  }, [url, onMessage]);

  return eventSourceRef.current;
}
