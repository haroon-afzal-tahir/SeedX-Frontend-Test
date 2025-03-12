/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

interface EventSourceMessage {
  event: string;
  data: string;
}

function parseResponse(str: string): EventSourceMessage {
  try {
    const lines = str.split("\n");
    let event = "";
    const data = lines.map((line) => {
      const [key, value] = line.split(": ");
      if (key === "event" && value.trim() === "chunk") {
        event = "chunk";
        return lines.slice(lines.indexOf(line) + 1).join("");
      } else if (key === "event") {
        event = value.trim();
      }
    });
    return { event, data: data.join("") };
  } catch (err) {
    console.error("Failed to parse response:", err);
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
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const urlRef = useRef<string | null>(null);

  const connect = () => {
    // Close any existing connection first
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (!url || url === urlRef.current) return;
    urlRef.current = url;

    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        if (event.data.startsWith(": ping")) return;
        const parsed = parseResponse(event.data);
        onMessage(parsed);
      } catch (err) {
        console.error("Failed to handle message:", err);
      }
    };

    eventSource.onerror = (event) => {
      console.error("EventSource error occurred:", event);
      setIsConnected(false);
      setError("Connection lost, attempting to reconnect...");
      eventSource.close();
      handleReconnect();
    };
  };

  const handleReconnect = () => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const retryTimeout = 1000 * Math.pow(2, reconnectAttemptsRef.current); // Exponential backoff
      setTimeout(() => {
        reconnectAttemptsRef.current += 1;
        connect();
      }, retryTimeout);
    } else {
      setError("Maximum reconnect attempts reached.");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        urlRef.current = null;
      }
    };
  }, [url]);

  return { isConnected, error };
}
