import { NextResponse } from "next/server";
import { getAnswer } from "@/lib/rag";
export async function POST(req: Request) {
  try {
    console.log("Received a HTTP request");

    // 解析请求体
    const body = await req.json();
    console.log(body);
    // 获取答案
    const answer = await getAnswer(body.text, body.img_url);
    console.log(answer);

    // 返回答案
    return NextResponse.json({ text: answer });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
