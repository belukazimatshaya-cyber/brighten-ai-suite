import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Mail, Copy, RefreshCw, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  head: () => ({ meta: [{ title: "Email Generator — Aura" }] }),
});

const tones = ["Professional", "Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!keyPoints.trim()) {
      toast.error("Add a few key points first");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { recipient, subject, keyPoints, tone } });
      setOutput(res.email);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="AI Tool"
        title="Smart Email Generator"
        description="Tell Aura the gist — get a polished, ready-to-send draft."
        icon={<Mail className="h-6 w-6" />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="rounded-3xl border-border/60 p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles className="h-4 w-4 text-primary" /> Inputs
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="mt-1 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recipient</Label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Maya, our design lead"
                  className="mt-1 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Q3 launch timeline update"
                  className="mt-1 h-11 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key points</Label>
                <Textarea
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="• Shipped beta to early access&#10;• Asking for design review by Fri&#10;• Schedule a 30-min sync next week"
                  className="mt-1 min-h-[140px] rounded-xl"
                />
              </div>
              <Button
                onClick={run}
                disabled={loading}
                className="h-12 w-full rounded-xl border-0 text-white shadow-glow transition-transform hover:scale-[1.01]"
                style={{ background: "var(--gradient-hero)" }}
              >
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                {loading ? "Drafting…" : "Generate Email"}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="relative h-full rounded-3xl border-border/60 p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Mail className="h-4 w-4 text-primary" /> Draft preview
              </h3>
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(output);
                      toast.success("Copied to clipboard");
                    }}
                    className="rounded-lg"
                  >
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={run} className="rounded-lg" disabled={loading}>
                    <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Regenerate
                  </Button>
                </div>
              )}
            </div>
            {output ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="min-h-[420px] rounded-xl font-mono text-sm leading-relaxed"
              />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 text-center text-sm text-muted-foreground">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Mail className="h-7 w-7" />
                </motion.div>
                Your beautifully crafted draft will appear here.
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
