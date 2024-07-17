import { NextResponse } from "next/server";
export async function POST(req: Request) {
  console.log("recive a http");
  const body = await req.json();
  console.log(body);
  return NextResponse.json(body);
}
