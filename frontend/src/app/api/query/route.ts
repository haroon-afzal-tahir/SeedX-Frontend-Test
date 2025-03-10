import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message, id } = await req.json();

  console.log(message);

  return NextResponse.json({ id, message });
}
