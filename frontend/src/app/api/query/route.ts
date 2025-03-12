import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  const query = searchParams.get("query");

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          `${process.env.API_URL}/query?${searchParams.toString()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "text/event-stream",
            },
            body: JSON.stringify({
              query: query,
              session_id: session_id,
            }),
          }
        );

        if (!response.ok) {
          controller.close();
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        // Read the response body
        let errorCount = 0;
        while (true) {
          try {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk and split into individual SSE messages
            const text = new TextDecoder().decode(value);
            const messages = text.split("\n\n").filter((msg) => msg.trim());

            // Process each SSE message
            for (const message of messages) {
              const lines = message.split("\n");
              console.log("Lines:", lines);
              const events = [];
              let currentEvent = null;

              for (const line of lines) {
                if (line.startsWith("event: ")) {
                  if (currentEvent) {
                    events.push(currentEvent);
                  }
                  currentEvent = {
                    event: line.slice(7).trim().replace("\r", ""),
                    data: "",
                  };
                } else if (line.startsWith("data: ") && currentEvent) {
                  currentEvent.data = line.slice(6).replace("\r", "");
                }
              }

              if (currentEvent) {
                events.push(currentEvent);
              }

              // Forward each event in the message
              for (const evt of events) {
                controller.enqueue(`data: ${JSON.stringify(evt)}\n\n`);
              }
            }
          } catch (readError) {
            console.error("Error reading stream:", readError);
            if (errorCount > 10) break;
            errorCount++;
          }
        }

        controller.close();
        reader.releaseLock();
      } catch (error) {
        console.error("Error in stream:", error);
        controller.error(error);
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
    status: 200,
  });
}
