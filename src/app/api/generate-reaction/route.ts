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

CRITICAL INSTRUCTIONS:
- Generate ONE sentence only, in Japanese
- Make the reaction HIGHLY SPECIFIC to this persona's values and concerns
- Use age-appropriate, natural spoken language
- DO NOT use generic phrases - dig deep into their specific motivations
- Show their unique perspective, skepticism, excitement, or indifference
- No quotation marks - just the raw reaction

EXAMPLES OF DIFFERENTIATED REACTIONS:
・Hardcore gym bro (28) → タンパク質何グラム？1食あたりのコスパ教えて
・Wellness-focused professional (32) → 人工甘味料使ってないよね？成分表見せて
・Complete beginner (35) → プロテインって筋肉モリモリになっちゃわない...？
・Fitness influencer (25) → パッケージ映えするならストーリーに上げるかも
・Health-conscious senior (62) → 製薬会社製なら安心できそうだけど、値段は？
・Budget student (17) → バイト代で買える値段なら友達と試してみたいな
・New mom (30) → 授乳中でも大丈夫な成分？子供の手の届かない場所に置けるサイズ？
・Aspiring bodybuilder (21) → BCAAとHMBの配合比は？海外製と比べてどう？

Now generate the reaction for this specific persona:`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
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
