import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { persona, concept } = await request.json();

    if (!persona || !concept) {
      return NextResponse.json(
        { error: "Persona and concept are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const prompt = `You are roleplaying as a specific person who just encountered a new protein product at the gym. Generate their AUTHENTIC first reaction based on their unique personality, values, and concerns.

PERSONA PROFILE:
- Name: ${persona.name}
- Age: ${persona.age}
- Background & Values: ${persona.traits}

PRODUCT MESSAGING: "${concept}"

ABSOLUTE REQUIREMENTS:
- YOU MUST respond ONLY in English - NO Thai, Japanese, Vietnamese, or any other language
- Even though the persona may be from Thailand or another country, they are responding in English for this international market research
- Generate ONE sentence only
- Make the reaction HIGHLY SPECIFIC to this persona's values and concerns
- Use age-appropriate, natural spoken language with casual contractions
- DO NOT use generic phrases - dig deep into their specific motivations
- Show their unique perspective, skepticism, excitement, or indifference
- No quotation marks - just the raw reaction

EXAMPLES OF ENGLISH-ONLY REACTIONS (these personas are from various countries but ALL respond in English):
・Hardcore gym bro (28) → How many grams of protein per serving? What's the price per serving?
・Wellness-focused professional (32) → Wait, does this have artificial sweeteners? Show me the ingredient list.
・Complete beginner (35) → Will I get too bulky if I drink this? I just want to tone up...
・Fitness influencer (25) → If the packaging looks good on camera, I might feature it in my stories.
・Health-conscious senior (62) → Pharmaceutical company? That's reassuring, but what's the price?
・Budget student (17) → If it's cheap enough for my allowance, I'd try it with my friends.
・New mom (30) → Is this safe while breastfeeding? Is the container small enough to keep away from kids?
・Aspiring bodybuilder (21) → What's the BCAA to HMB ratio? How does it compare to imported brands?

CRITICAL: Your response must be 100% in English. Do not include any Thai, Japanese, or other language words or phrases.

Now generate the ENGLISH reaction for this specific persona:`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      system: "You are an assistant that ALWAYS responds in English only, regardless of the persona's nationality or background. Never use Thai, Japanese, Vietnamese, or any other non-English language.",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reactionText =
      message.content[0].type === "text"
        ? message.content[0].text.replace(/^["']|["']$/g, "").trim()
        : "興味深いですね...";

    // Determine sentiment based on keywords (more comprehensive)
    const text = reactionText.toLowerCase();
    let sentiment = "🤔 Considering";

    if (
      text.includes("いい") ||
      text.includes("良い") ||
      text.includes("よさそう") ||
      text.includes("欲しい") ||
      text.includes("試したい") ||
      text.includes("興味") ||
      text.includes("買") ||
      text.includes("飲んでみ") ||
      text.includes("魅力") ||
      text.includes("素晴らしい") ||
      text.includes("最高") ||
      text.includes("気になる")
    ) {
      sentiment = "😍 Interested";
    } else if (
      text.includes("?") ||
      text.includes("？") ||
      text.includes("どのくらい") ||
      text.includes("どんな") ||
      text.includes("教えて") ||
      text.includes("知りたい") ||
      text.includes("どう") ||
      text.includes("何")
    ) {
      sentiment = "💡 Has Questions";
    } else if (
      text.includes("うーん") ||
      text.includes("微妙") ||
      text.includes("どうかな") ||
      text.includes("迷") ||
      text.includes("わからない")
    ) {
      sentiment = "😐 Undecided";
    } else if (
      text.includes("ヤバい") ||
      text.includes("すごい") ||
      text.includes("マジで") ||
      text.includes("！")
    ) {
      sentiment = "✨ Positive";
    } else if (
      text.includes("見て") ||
      text.includes("チェック") ||
      text.includes("確認")
    ) {
      sentiment = "👀 Curious";
    }

    return NextResponse.json({
      text: reactionText,
      sentiment: sentiment,
    });
  } catch (error: any) {
    console.error("Error generating reaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate reaction" },
      { status: 500 }
    );
  }
}
