import { OpenAI } from "openai";
import { NextResponse } from "next/server";

//Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

//Venice API Key
const openai = new OpenAI({
  apiKey: process.env.VENICE_API_KEY,
  baseURL: "https://api.venice.ai/api/v1",
});

//own model with webui --api flag
// const openai = new OpenAI({
//   baseURL: `http://127.0.0.1:5000/v1`,
// });

interface JokeEvaluation {
  funnyScore: number;
  appropriateScore: number;
  isOffensive: boolean;
  badges: string[];
}

export async function POST(req: Request) {
  try {
    const { topic, tone, type, temperature } = await req.json();

    if (!topic || !tone || !type || temperature === undefined) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const prompt = `Generate a ${tone} ${type} joke about ${topic}. The joke should be appropriate for all audiences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a professional comedian who specializes in creating appropriate, engaging jokes. Your jokes should be clever and suitable for all audiences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: temperature,
      max_tokens: 200,
    });

    const joke =
      completion.choices[0]?.message?.content ||
      "Sorry, could not generate a joke at this time.";

    // Evaluate the joke
    const evaluationCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a joke evaluator. Analyze jokes and provide scores and badges. Respond in JSON format with the following structure: { funnyScore: number 1-10, appropriateScore: number 1-10, isOffensive: boolean, badges: string[] }. Badges should be emoji + text combinations that highlight the joke's characteristics (e.g., '😂 Hilarious', '🤔 Clever', '👨‍👩‍👧‍👦 Family-Friendly').",
        },
        {
          role: "user",
          content: `Evaluate this joke: "${joke}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    let evaluation: JokeEvaluation = {
      funnyScore: 0,
      appropriateScore: 0,
      isOffensive: false,
      badges: [],
    };

    try {
      const evaluationText =
        evaluationCompletion.choices[0]?.message?.content || "";
      evaluation = JSON.parse(evaluationText);
    } catch (e) {
      console.error("Error parsing joke evaluation:", e);
    }

    return NextResponse.json({ joke, evaluation });
  } catch (error) {
    console.error("Error generating joke:", error);
    return NextResponse.json(
      { error: "Failed to generate joke" },
      { status: 500 }
    );
  }
}
