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
      // Create new EventSource instance
      const eventSource = new EventSource(requestUrl);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error("Failed to parse event data:", error);
        }
      };

      eventSource.onerror = (event: Event) => {
        console.error("EventSource failed:", event);
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };

      eventSource.onopen = (event: Event) => {
        console.log("EventSource connection opened:", event);
      };

      // Cleanup function
      return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
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
