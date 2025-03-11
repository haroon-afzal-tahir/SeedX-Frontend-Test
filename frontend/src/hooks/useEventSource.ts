/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

function parseResponse(str: string) {
  const lines = str.split("\n");
  const result: { [key: string]: string } = {};

  lines.forEach((line) => {
    const [key, value] = line.split(":").map((s) => s.trim());
    result[key] = value;
  });

  return result;
}

export function useEventSource(
  url: string | null,
  onMessage: (data: any) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!url) {
      console.log("No URL provided, skipping connection");
      return;
    }
    if (eventSourceRef.current) {
      console.log("Closing existing connection");
      eventSourceRef.current.close();
    }

    console.log("Creating new EventSource connection to:", url);
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("EventSource connection opened");
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;
    };

    eventSource.onmessage = (event) => {
      console.log("Raw event data:", event.data);
      try {
        if (event.data.startsWith(": ping")) {
          return;
        }
        // Try to pass the raw data if parsing fails
        let parsed;
        try {
          parsed = parseResponse(event.data);
        } catch (parseErr) {
          console.log("Parsing failed, using raw data");
          parsed = event.data;
        }
        console.log("Processed data:", parsed);
        onMessage(parsed);
      } catch (err) {
        console.error("Failed to handle message:", err);
        // Still try to send the raw data
        onMessage(event.data);
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
      eventSourceRef.current?.close(); // Clean up connection on unmount
    };
  }, [url]);

  return { isConnected, error };
}
