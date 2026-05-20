import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { FileText, Sparkles, Upload, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/PageHeader";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  component: MeetingsPage,
  head: () => ({ meta: [{ title: "Meeting Summarizer — Aura" }] }),
});

function MeetingsPage() {
  const summarize = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first");
      return;
    }
    setLoading(true);
    try {
      const res = await summarize({ data: { notes } });
      setOut(res.summary);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="AI Tool"
        title="Meeting Notes Summarizer"
        description="Drop raw notes — get clean summaries, action items, and deadlines."
        icon={<FileText className="h-6 w-6" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-3xl border-border/60 p-6 shadow-card">
            <div
              className="relative rounded-2xl p-[2px]"
              style={{ background: "var(--gradient-hero)" }}
            >
              <div className="rounded-[14px] bg-card p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Upload className="h-4 w-4" /> Paste meeting notes
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste transcript, bullet notes, or recap text here…"
                  className="min-h-[340px] resize-none rounded-xl border-border/60 bg-background text-sm"
                />
              </div>
            </div>
            <Button
              onClick={run}
              disabled={loading}
              className="mt-5 h-12 w-full rounded-xl border-0 text-white shadow-glow"
              style={{ background: "var(--gradient-hero)" }}
            >
              {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Summarizing…" : "Summarize with AI"}
            </Button>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}>
          <Card className="h-full rounded-3xl border-border/60 p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> Smart summary
            </h3>
            {out ? (
              <div className="prose prose-sm max-w-none rounded-2xl bg-muted/30 p-5 text-foreground prose-headings:font-display prose-headings:text-foreground prose-strong:text-foreground prose-li:text-foreground">
                <ReactMarkdown>{out}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 text-center text-sm text-muted-foreground">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
                  style={{ background: "var(--gradient-pink)" }}
                >
                  <FileText className="h-7 w-7" />
                </motion.div>
                Your elegant summary will land right here.
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
