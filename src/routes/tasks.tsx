import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, Sparkles, RefreshCw, Check, Circle } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
  head: () => ({ meta: [{ title: "AI Task Planner — Aura" }] }),
});

type Task = { title: string; priority: string; duration: string; time: string; done?: boolean };

const priorityColor = (p: string) => {
  const k = p.toLowerCase();
  if (k === "high") return "var(--gradient-pink)";
  if (k === "medium") return "var(--gradient-primary)";
  return "var(--gradient-mint)";
};

function TasksPage() {
  const plan = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [horizon, setHorizon] = useState<"day" | "week">("day");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  async function run() {
    if (!goal.trim()) {
      toast.error("Describe your goals first");
      return;
    }
    setLoading(true);
    try {
      const res = await plan({ data: { goal, horizon } });
      setTasks(res.tasks.map((t) => ({ ...t, done: false })));
      if (!res.tasks.length) toast.error("Couldn't parse the plan. Try again.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  function toggle(i: number) {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t)));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="AI Tool"
        title="AI Task Planner"
        description="Tell Aura your goals — get a thoughtful, prioritized plan."
        icon={<CalendarCheck className="h-6 w-6" />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="h-fit rounded-3xl border-border/60 p-6 shadow-card">
          <Tabs value={horizon} onValueChange={(v) => setHorizon(v as "day" | "week")}>
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="day" className="rounded-lg">Daily</TabsTrigger>
              <TabsTrigger value="week" className="rounded-lg">Weekly</TabsTrigger>
            </TabsList>
          </Tabs>
          <Textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Ship landing page, prep investor deck, daily 30-min workout, deep-work on Q3 roadmap…"
            className="mt-4 min-h-[180px] rounded-xl"
          />
          <Button
            onClick={run}
            disabled={loading}
            className="mt-4 h-12 w-full rounded-xl border-0 text-white shadow-glow"
            style={{ background: "var(--gradient-hero)" }}
          >
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Planning…" : "Build my plan"}
          </Button>

          {tasks.length > 0 && (
            <div className="mt-6 rounded-2xl bg-muted/40 p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-primary">{completed} / {tasks.length} done</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border-border/60 p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <CalendarCheck className="h-4 w-4 text-primary" />
              {horizon === "day" ? "Today's plan" : "This week"}
            </h3>
            <span className="text-xs text-muted-foreground">{tasks.length} items</span>
          </div>

          {tasks.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 text-center text-sm text-muted-foreground">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-glow"
                style={{ background: "var(--gradient-sky)" }}
              >
                <CalendarCheck className="h-7 w-7" />
              </motion.div>
              Your beautifully prioritized plan will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {tasks.map((t, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group flex items-center gap-3 rounded-2xl border border-border/60 p-4 transition-all hover:shadow-soft ${
                      t.done ? "opacity-60" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggle(i)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-border transition-all hover:border-primary"
                      style={t.done ? { background: "var(--gradient-mint)", borderColor: "transparent" } : {}}
                    >
                      {t.done ? <Check className="h-4 w-4 text-white" /> : <Circle className="h-4 w-4 text-muted-foreground/40" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className={`font-medium ${t.done ? "line-through" : ""}`}>{t.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {t.time && <span>{t.time}</span>}
                        {t.time && t.duration && <span> · </span>}
                        {t.duration && <span>{t.duration}</span>}
                      </div>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft"
                      style={{ background: priorityColor(t.priority) }}
                    >
                      {t.priority}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
