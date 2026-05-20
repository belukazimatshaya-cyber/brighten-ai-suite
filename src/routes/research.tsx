import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Bookmark, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  component: ResearchPage,
  head: () => ({ meta: [{ title: "AI Research Assistant — Aura" }] }),
});

type Saved = { id: string; topic: string; content: string; at: number };

function ResearchPage() {
  const research = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Saved[]>([]);

  async function run() {
    if (!topic.trim()) {
      toast.error("Enter a topic or paste an article");
      return;
    }
    setLoading(true);
    try {
      const res = await research({ data: { topic } });
      setOut(res.result);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (!out) return;
    setSaved((s) => [{ id: crypto.randomUUID(), topic: topic.slice(0, 80), content: out, at: Date.now() }, ...s]);
    toast.success("Saved to your notes");
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="AI Tool"
        title="Research Assistant"
        description="Paste an article or topic — get summary, insights, and recommendations."
        icon={<Sparkles className="h-6 w-6" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr_320px]">
        <Card className="h-fit rounded-3xl border-border/60 p-6 shadow-card">
          <h3 className="mb-3 font-display text-lg font-bold">Topic or article</h3>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 'Latest trends in agentic AI for enterprise productivity' or paste an article…"
            className="min-h-[220px] rounded-xl"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="mt-4 h-12 w-full rounded-xl border-0 text-white shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Researching…" : "Research with AI"}
          </Button>
        </Card>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="h-full rounded-3xl border-border/60 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Research findings</h3>
              {out && (
                <Button size="sm" variant="outline" onClick={save} className="rounded-lg">
                  <Bookmark className="mr-1.5 h-3.5 w-3.5" /> Save
                </Button>
              )}
            </div>
            {out ? (
              <div className="prose prose-sm max-w-none rounded-2xl bg-muted/30 p-5 text-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                <ReactMarkdown>{out}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 text-center text-sm text-muted-foreground">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
                  style={{ background: "var(--gradient-mint)" }}
                >
                  <Sparkles className="h-7 w-7" />
                </motion.div>
                Your research insights will appear here.
              </div>
            )}
          </Card>
        </motion.div>

        <Card className="rounded-3xl border-border/60 p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
            <Bookmark className="h-4 w-4 text-primary" /> Saved notes
          </h3>
          {saved.length === 0 ? (
            <p className="text-xs text-muted-foreground">Save research to revisit later.</p>
          ) : (
            <div className="space-y-2">
              {saved.map((s) => (
                <div key={s.id} className="group rounded-xl border border-border/60 p-3 text-xs hover:shadow-soft">
                  <div className="mb-1 line-clamp-2 font-semibold">{s.topic || "Untitled"}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(s.at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSaved((p) => p.filter((x) => x.id !== s.id))}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
