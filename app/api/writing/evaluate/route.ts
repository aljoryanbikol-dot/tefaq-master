export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { evaluateWriting } from "@/lib/openai";
import type { CEFRLevel } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { text, prompt, targetLevel } = await request.json();

    if (!text || !prompt) {
      return NextResponse.json({ error: "Text and prompt are required" }, { status: 400 });
    }

    if (text.trim().split(/\s+/).length < 20) {
      return NextResponse.json({ error: "Text is too short for evaluation" }, { status: 400 });
    }

    const evaluation = await evaluateWriting(text, prompt, (targetLevel || "B1") as CEFRLevel);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Writing evaluation error:", error);
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
