/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";

export function useEventSource(
  url: string | null,
  onMessage: (data: any) => void
) {
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
      console.log("requestUrl", requestUrl);
      // Create new EventSource instance
      const eventSource = new EventSource(requestUrl, {
        withCredentials: true,
      });
      eventSourceRef.current = eventSource;

      // Add message handler
      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Failed to parse event data:", error);
        }
      };

      eventSource.onmessage = messageHandler;

      // Add error handler
      const errorHandler = (event: Event) => {
        console.error("EventSource failed:", event);
        eventSource.close();
        eventSourceRef.current = null;
      };

      eventSource.onerror = errorHandler;

      // Cleanup function
      return () => {
        eventSource.removeEventListener("message", messageHandler);
        eventSource.removeEventListener("error", errorHandler);
        eventSource.close();
        eventSourceRef.current = null;
      };
    } catch (error) {
      console.error("Failed to create EventSource:", error);
      return undefined;
    }
  }, [url, onMessage]);

  return eventSourceRef.current;
}
