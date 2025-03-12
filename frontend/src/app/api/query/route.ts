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
        while (true) {
          try {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value);
            controller.enqueue(`data: ${text}\n\n`);
          } catch (readError) {
            console.error("Error reading stream:", readError);
          }
        }

        reader.releaseLock();
      } catch (error) {
        console.error("Error in stream:", error);
        controller.error(error);
      } finally {
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
