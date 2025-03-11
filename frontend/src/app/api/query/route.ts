import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const message = searchParams.get("message");

  const response = await fetch(`${process.env.API_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      query: message,
      session_id: id,
    }),
  });

  // Remove or comment out console.log statements as they might interfere with the stream
  if (!response.ok) {
    return NextResponse.json(
      { error: "Upstream request failed" },
      { status: response.status }
    );
  }

  return new NextResponse(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
