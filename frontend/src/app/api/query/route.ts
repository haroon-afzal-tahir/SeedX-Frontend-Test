import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const message = searchParams.get("message");

  const response = await fetch(`${process.env.API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: message,
      session_id: id,
    }),
  });

  console.log("response", response);

  // Verify the response status
  if (!response.ok) {
    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: response.status }
    );
  }

  // Verify that we received an SSE response
  const contentType = response.headers.get("content-type");
  console.log("contentType", contentType);
  if (!contentType?.includes("text/event-stream")) {
    return NextResponse.json(
      { error: "Invalid response format from upstream" },
      { status: 500 }
    );
  }

  console.log("response.body", response.body);

  // Forward the SSE response with appropriate headers
  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
