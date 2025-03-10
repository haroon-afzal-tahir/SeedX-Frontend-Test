import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, id } = await req.json();

  const response = await fetch(`${process.env.API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: message,
      session_id: id
    }),
  });

  // Stream the response
  const reader = response.body?.getReader();
  const stream = new ReadableStream({
    start(controller) {
      function push() {
        reader?.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          push();
        });
      }
      push();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
