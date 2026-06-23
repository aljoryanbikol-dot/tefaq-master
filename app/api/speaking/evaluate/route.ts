export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { evaluateSpeaking } from "@/lib/openai";
import type { CEFRLevel } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { audioBase64, prompt, targetLevel } = await request.json();

    if (!audioBase64 || !prompt) {
      return NextResponse.json({ error: "Audio and prompt are required" }, { status: 400 });
    }

    const evaluation = await evaluateSpeaking(audioBase64, prompt, (targetLevel || "B1") as CEFRLevel);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Speaking evaluation error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
