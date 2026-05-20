import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageCircle, Plus, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { chatWithAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Aura AI Chat" }] }),
});

type Msg = { role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; messages: Msg[] };

const suggestions = [
  "Draft a follow-up to a client who's gone quiet",
  "Help me prioritize my next 2 hours",
  "Explain OKRs like I'm new to them",
  "Brainstorm a witty all-hands intro",
];

function ChatPage() {
  const chat = useServerFn(chatWithAssistant);
  const [threads, setThreads] = useState<Thread[]>([
    { id: "1", title: "New conversation", messages: [] },
  ]);
  const [activeId, setActiveId] = useState("1");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active.messages, loading]);

  function newThread() {
    const id = crypto.randomUUID();
    setThreads((t) => [{ id, title: "New conversation", messages: [] }, ...t]);
    setActiveId(id);
  }

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...active.messages, userMsg];
    setThreads((ts) =>
      ts.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: next,
              title: t.messages.length === 0 ? content.slice(0, 40) : t.title,
            }
          : t,
      ),
    );
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      setThreads((ts) =>
        ts.map((t) =>
          t.id === activeId
            ? { ...t, messages: [...next, { role: "assistant", content: res.reply }] }
            : t,
        ),
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="AI Tool"
        title="Aura Chat"
        description="Your friendly AI co-worker. Ask anything."
        icon={<MessageCircle className="h-6 w-6" />}
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Thread list */}
        <Card className="h-fit rounded-3xl border-border/60 p-4 shadow-card">
          <Button
            onClick={newThread}
            className="mb-3 h-10 w-full rounded-xl border-0 text-white shadow-soft"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> New chat
          </Button>
          <div className="space-y-1.5">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full truncate rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                  t.id === activeId
                    ? "bg-primary/10 font-semibold text-primary"
                    : "hover:bg-muted"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </Card>

        {/* Chat panel */}
        <Card className="flex h-[70vh] flex-col overflow-hidden rounded-3xl border-border/60 shadow-card">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6">
            {active.messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-glow"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Sparkles className="h-9 w-9" />
                </motion.div>
                <h2 className="font-display text-2xl font-bold">Hey, I'm Aura ✨</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Your AI productivity sidekick. Try one of these to start:
                </p>
                <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-2xl border border-border/60 bg-card/60 p-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {active.messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft"
                        style={{
                          background:
                            m.role === "user" ? "var(--gradient-pink)" : "var(--gradient-hero)",
                        }}
                      >
                        {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-soft ${
                          m.role === "user"
                            ? "rounded-tr-sm bg-primary text-primary-foreground"
                            : "rounded-tl-sm bg-card border border-border/60"
                        }`}
                      >
                        {m.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none text-foreground prose-p:my-2 prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-2xl text-white shadow-soft"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border/60 bg-card px-4 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-primary"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border/60 bg-card/60 p-4 backdrop-blur">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Message Aura…  (Shift+Enter for newline)"
                className="max-h-[140px] min-h-[48px] flex-1 resize-none rounded-2xl border-border/60 bg-background"
              />
              <Button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="h-12 w-12 shrink-0 rounded-2xl border-0 p-0 text-white shadow-glow transition-transform hover:scale-105"
                style={{ background: "var(--gradient-hero)" }}
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              AI-generated content may contain inaccuracies. Verify important info.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
