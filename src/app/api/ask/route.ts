import { getChapter } from "@/lib/content";

/**
 * 글을 읽다가 생긴 질문을, 그 글을 근거로 답하게 하는 엔드포인트.
 *
 * 아직 화면(UI)은 붙이지 않았다. 키가 없으면 503으로 조용히 꺼져 있으므로
 * 배포해도 안전하다. 쓰려면 .env.local에 OPENAI_API_KEY만 넣으면 된다.
 *
 *   POST /api/ask
 *   { "category": "network", "slug": "tcp-quic", "question": "…" }
 */

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  let payload: { category?: string; slug?: string; question?: string };
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "JSON 형식이 아닙니다." }, { status: 400 });
  }

  const { category, slug, question } = payload;
  if (!category || !slug || !question?.trim()) {
    return Response.json(
      { error: "category, slug, question이 모두 필요합니다." },
      { status: 400 }
    );
  }

  const chapter = getChapter(category, slug);
  if (!chapter) {
    return Response.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "너는 CS 학습 노트의 조교다. 아래 본문을 근거로만 한국어로 답한다. " +
            "본문에 없는 내용은 추측하지 말고 '본문에는 없다'고 먼저 밝힌 뒤 일반적인 설명을 덧붙인다. " +
            "짧은 문단과 비유를 쓰고, 정확도를 우선한다.",
        },
        {
          role: "user",
          content: `[본문: ${chapter.title}]\n\n${chapter.body}\n\n[질문]\n${question}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    return Response.json(
      { error: `OpenAI 응답 오류 (${res.status})` },
      { status: 502 }
    );
  }

  const data = await res.json();
  return Response.json({
    answer: data.choices?.[0]?.message?.content ?? "",
  });
}
