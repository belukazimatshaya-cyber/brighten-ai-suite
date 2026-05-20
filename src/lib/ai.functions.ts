import { createServerFn } from "@tanstack/react-start";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

async function callLovableAI(messages: ChatMessage[], model = "google/gemini-3-flash-preview") {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace settings.");
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { recipient: string; subject: string; keyPoints: string; tone: string }) => input,
  )
  .handler(async ({ data }) => {
    const system =
      "You are a world-class business writing assistant. Write polished, ready-to-send emails. Respond with ONLY the email body (no preamble, no markdown fences). Include greeting and sign-off.";
    const user = `Write a ${data.tone.toLowerCase()} email.
Recipient: ${data.recipient || "the recipient"}
Subject: ${data.subject || "(no subject provided)"}
Key points:
${data.keyPoints}

Keep it concise, well-structured, and professional.`;
    const content = await callLovableAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { email: content };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: { notes: string }) => input)
  .handler(async ({ data }) => {
    const system =
      "You are an executive assistant. Summarize meeting notes into clean markdown with these exact sections: ## Summary, ## Action Items (bulleted, each with assignee if mentioned), ## Deadlines (bulleted), ## Key Decisions. Be concise and actionable.";
    const content = await callLovableAI([
      { role: "system", content: system },
      { role: "user", content: data.notes },
    ]);
    return { summary: content };
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: { goal: string; horizon: "day" | "week" }) => input)
  .handler(async ({ data }) => {
    const system = `You are a productivity coach. Generate a focused ${data.horizon === "day" ? "daily" : "weekly"} plan as a JSON array. Each item: { "title": string, "priority": "high"|"medium"|"low", "duration": string, "time": string }. Return ONLY valid JSON, no markdown fences.`;
    const content = await callLovableAI([
      { role: "system", content: system },
      { role: "user", content: data.goal },
    ]);
    const cleaned = content.replace(/```json|```/g, "").trim();
    try {
      const tasks = JSON.parse(cleaned);
      return { tasks: Array.isArray(tasks) ? tasks : [] };
    } catch {
      return { tasks: [] as Array<{ title: string; priority: string; duration: string; time: string }> };
    }
  });

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: { topic: string }) => input)
  .handler(async ({ data }) => {
    const system =
      "You are a sharp research analyst. Given a topic or article, produce markdown with sections: ## Summary, ## Key Insights (bulleted), ## Recommendations (bulleted), ## Notes (bulleted). Be specific, avoid filler.";
    const content = await callLovableAI([
      { role: "system", content: system },
      { role: "user", content: data.topic },
    ]);
    return { result: content };
  });

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[] }) => input)
  .handler(async ({ data }) => {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are Aura, a friendly, witty, highly capable AI productivity assistant. Use markdown when helpful. Be concise but warm.",
      },
      ...data.messages,
    ];
    const content = await callLovableAI(messages);
    return { reply: content };
  });
