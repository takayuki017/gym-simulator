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

    const prompt = `あなたは、ジムで新しいプロテイン製品を見かけた人物です。以下のペルソナになりきって、製品に対する第一印象を一言で答えてください。

ペルソナ:
- ${persona.name}（${persona.age}歳）
- ${persona.traits}

製品: "${concept}"

指示:
- 必ず1文のみ、日本語で答える
- ペルソナの特徴・価値観を反映させる
- 年齢に応じた自然な話し言葉を使う
- 引用符は不要、反応のみ書く

例:
・ハードコア筋トレマン → タンパク質含有量とコスパはどうなの？
・美容志向OL → パッケージ可愛いならインスタに載せたいかも
・初心者 → プロテインって初めてだけど、飲みやすいのかな？`;

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
