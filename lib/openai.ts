import type {
  SpeakingEvaluation,
  WritingEvaluation,
  CEFRLevel,
  StudyRecommendation,
} from "@/types";

// Lazy-initialize OpenAI client only at runtime (not at build time)
function getOpenAI() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const OpenAI = require("openai").default;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "placeholder" });
}

export async function evaluateSpeaking(
  audioBase64: string,
  prompt: string,
  targetLevel: CEFRLevel
): Promise<SpeakingEvaluation> {
  const openai = getOpenAI();
  const audioBuffer = Buffer.from(audioBase64, "base64");
  const audioFile = new File([audioBuffer], "recording.webm", { type: "audio/webm" });

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: "fr",
  });

  const transcript = transcription.text;

  const evaluation = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert French language examiner specializing in TEFAQ oral evaluation. Always respond in valid JSON format only.`,
      },
      {
        role: "user",
        content: `Evaluate this French speaking response for TEFAQ.
Speaking Prompt: "${prompt}"
Transcribed Response: "${transcript}"
Target CEFR Level: ${targetLevel}

Return JSON:
{
  "overall_score": <0-100>,
  "cefr_level": <"A1"|"A2"|"B1"|"B2"|"C1">,
  "pronunciation_score": <0-100>,
  "fluency_score": <0-100>,
  "grammar_score": <0-100>,
  "vocabulary_score": <0-100>,
  "coherence_score": <0-100>,
  "transcript": "${transcript}",
  "feedback": "<paragraph in French>",
  "strengths": ["<s1>","<s2>","<s3>"],
  "weaknesses": ["<w1>","<w2>"],
  "suggestions": ["<tip1>","<tip2>","<tip3>"]
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = evaluation.choices[0].message.content || "{}";
  return JSON.parse(content) as SpeakingEvaluation;
}

export async function evaluateWriting(
  text: string,
  prompt: string,
  targetLevel: CEFRLevel
): Promise<WritingEvaluation> {
  const openai = getOpenAI();

  const evaluation = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are an expert French language examiner specializing in TEFAQ written evaluation. Always respond in valid JSON format only.`,
      },
      {
        role: "user",
        content: `Evaluate this French writing for TEFAQ.
Prompt: "${prompt}"
Text: "${text}"
Target Level: ${targetLevel}

Return JSON:
{
  "overall_score": <0-100>,
  "cefr_level": <"A1"|"A2"|"B1"|"B2"|"C1">,
  "grammar_score": <0-100>,
  "vocabulary_score": <0-100>,
  "coherence_score": <0-100>,
  "task_achievement_score": <0-100>,
  "feedback": "<paragraph in French>",
  "grammar_corrections": [{"original":"<wrong>","corrected":"<right>","explanation":"<why>"}],
  "vocabulary_suggestions": [{"original":"<basic>","better_alternatives":["<better1>","<better2>"],"context":"<usage>"}],
  "strengths": ["<s1>","<s2>"],
  "weaknesses": ["<w1>","<w2>"]
}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const content = evaluation.choices[0].message.content || "{}";
  return JSON.parse(content) as WritingEvaluation;
}

export async function generateStudyRecommendations(
  scores: { reading: number; listening: number; speaking: number; writing: number },
  currentLevel: CEFRLevel
): Promise<StudyRecommendation[]> {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a TEFAQ coach. Respond in valid JSON only." },
      {
        role: "user",
        content: `Level: ${currentLevel}, Scores: reading ${scores.reading}, listening ${scores.listening}, speaking ${scores.speaking}, writing ${scores.writing}.
Return JSON array: [{"module":"reading"|"listening"|"speaking"|"writing","reason":"<why>","priority":"high"|"medium"|"low"}]`,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  });

  const content = response.choices[0].message.content || "[]";
  return JSON.parse(content) as StudyRecommendation[];
}

export async function generateReadingExercise(level: CEFRLevel, topic: string) {
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a TEFAQ content creator. Respond in valid JSON only." },
      {
        role: "user",
        content: `Create a TEFAQ reading exercise. Level: ${level}, Topic: ${topic}.
Return JSON: {"title":"<title>","text":"<passage>","questions":[{"question":"<q>","options":["A","B","C","D"],"correct_answer":<0-3>,"explanation":"<why>"}]}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0].message.content || "{}";
  return JSON.parse(content);
}
