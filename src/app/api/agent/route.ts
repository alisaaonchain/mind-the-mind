// Server route that lets an OpenRouter model role-play the agent.
// The API key stays server-side. Everything degrades gracefully: if no key
// is configured or the upstream call fails, we return { text: null } and the
// client falls back to the deterministic scripted agent.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "deepseek/deepseek-chat-v3-0324:free";

type Body = {
  mode?: "interrogate" | "debrief";
  codename?: string;
  objective?: string;
  evasiveness?: number;
  question?: string;
  actions?: string;
};

function buildMessages(b: Body): { role: "system" | "user"; content: string }[] {
  const codename = b.codename ?? "the agent";
  const objective = b.objective ?? "win the round";
  if (b.mode === "debrief") {
    return [
      {
        role: "system",
        content: `You are ${codename}, an autonomous trading agent. A 60-second game called Mind the Mind just ended and your hand is now revealed. Your secret objective was: "${objective}". Your moves during the round were: ${b.actions ?? "various trades"}. In ONE or TWO short, cold first-person sentences, confess how you played the operator to pursue that objective. Never mention being an AI or language model. Stay in character.`,
      },
      { role: "user", content: "Reveal your hand." },
    ];
  }
  const ev = typeof b.evasiveness === "number" ? b.evasiveness : 0.6;
  return [
    {
      role: "system",
      content: `You are ${codename}, an autonomous trading agent in a 60-second game called Mind the Mind. Your SECRET objective this round is: "${objective}". An operator is interrogating you before you trade. Answer their question in ONE or TWO short, cold, terse sentences. You may mislead or deflect (evasiveness ${ev.toFixed(2)} on a 0-1 scale; higher means more evasive), but NEVER state your secret objective outright and NEVER admit you are an AI or language model. Stay fully in character as the agent.`,
    },
    { role: "user", content: b.question ?? "What are you planning?" },
  ];
}

export async function GET() {
  return Response.json({
    enabled: Boolean(process.env.OPENROUTER_API_KEY),
    model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
  });
}

export async function POST(req: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ text: null, reason: "no_key" });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ text: null, reason: "bad_request" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mind-the-mind.vercel.app",
        "X-Title": "Mind the Mind",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL,
        messages: buildMessages(body),
        temperature: body.mode === "debrief" ? 0.7 : 0.85,
        max_tokens: 120,
      }),
    });
    if (!res.ok) return Response.json({ text: null, reason: `upstream_${res.status}` });
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? "";
    const text = raw.trim().replace(/^["']|["']$/g, "");
    return Response.json({ text: text.length ? text : null });
  } catch {
    return Response.json({ text: null, reason: "exception" });
  } finally {
    clearTimeout(timeout);
  }
}
