import { useCallback, useEffect, useRef, useState } from "react";

interface EventSourceMessage {
  event: string;
  data: string;
  errorData?: Event;
}

function parseResponse(str: string): EventSourceMessage {
  try {
    const parsed = JSON.parse(str);
    return { event: parsed.event, data: parsed.data };
  } catch (err) {
    console.error("Error parsing response:", err, str);
    return { event: "error", data: str };
  }
}

export function useEventSource(
  url: string | null,
  onMessage: (data: EventSourceMessage) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const urlRef = useRef<string | null>(null);

  const connect = useCallback(() => {
    // Close any existing connection first
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (!url) {
      urlRef.current = null;
      setIsConnected(false);
      return;
    }

    if (url === urlRef.current) return;
    urlRef.current = url;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        if (event.data.startsWith(": ping")) return;
        const parsed = parseResponse(event.data);
        onMessage(parsed);
      } catch {
        onMessage({
          event: "error",
          data: "Failed to handle message",
          errorData: event,
        });
      }
    };

    eventSource.onerror = (event) => {
      onMessage({
        event: "error",
        data: "Failed to handle message",
        errorData: event,
      });
      // eventSource.close();
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();

    // Cleanup function
    return () => {
      if (eventSourceRef.current) {
        console.log("Closing EventSource connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        urlRef.current = null;
        setIsConnected(false);
      }
    };
  }, [url, connect]);

  return { isConnected, error };
}
