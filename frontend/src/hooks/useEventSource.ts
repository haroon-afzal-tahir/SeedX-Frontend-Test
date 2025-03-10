/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

export function useEventSource(url: string, onMessage: (data: any) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    // Cleanup function to close the EventSource when the component unmounts
    return () => {
      eventSourceRef.current?.close();
    };
  }, [url, onMessage]);
}
