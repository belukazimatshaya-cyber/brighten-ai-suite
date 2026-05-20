import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mail,
  FileText,
  CalendarCheck,
  Sparkles,
  MessageCircle,
  TrendingUp,
  Zap,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [{ title: "Dashboard — Aura AI Workplace" }],
  }),
});

const tools = [
  {
    title: "Smart Email",
    desc: "Draft polished emails in seconds",
    icon: Mail,
    to: "/email",
    gradient: "var(--gradient-primary)",
  },
  {
    title: "Meeting Notes",
    desc: "Summaries, action items, deadlines",
    icon: FileText,
    to: "/meetings",
    gradient: "var(--gradient-pink)",
  },
  {
    title: "Task Planner",
    desc: "AI-built daily & weekly plans",
    icon: CalendarCheck,
    to: "/tasks",
    gradient: "var(--gradient-sky)",
  },
  {
    title: "Research",
    desc: "Insights, recommendations, notes",
    icon: Sparkles,
    to: "/research",
    gradient: "var(--gradient-mint)",
  },
  {
    title: "Aura Chat",
    desc: "Your friendly AI co-worker",
    icon: MessageCircle,
    to: "/chat",
    gradient: "var(--gradient-hero)",
  },
];

const stats = [
  { label: "Tasks done this week", value: "42", delta: "+18%", icon: TrendingUp, color: "var(--gradient-mint)" },
  { label: "Emails drafted", value: "126", delta: "+9%", icon: Mail, color: "var(--gradient-primary)" },
  { label: "Meetings summarized", value: "17", delta: "+24%", icon: FileText, color: "var(--gradient-pink)" },
  { label: "Hours saved", value: "11.3", delta: "+32%", icon: Clock, color: "var(--gradient-sky)" },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 overflow-hidden rounded-3xl p-7 md:p-10"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-blob rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 right-32 h-56 w-56 animate-blob rounded-full bg-white/10 blur-3xl [animation-delay:3s]" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Welcome back, Alex
          </div>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl">
            Your AI workplace, <br className="hidden md:block" />ready to make today brilliant.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/85 md:text-base">
            Draft emails, summarize meetings, plan your day, and research deep — all in one beautiful, focused space.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:scale-[1.03]"
            >
              <Zap className="h-4 w-4" /> Ask Aura anything
            </Link>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Plan my day <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="group relative overflow-hidden rounded-2xl border-border/60 p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{ background: s.color }}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success-foreground">
                  {s.delta}
                </span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tool grid */}
      <div className="mb-2 flex items-end justify-between">
        <h2 className="font-display text-xl font-bold md:text-2xl">Quick access</h2>
        <span className="text-xs text-muted-foreground">5 tools · powered by Lovable AI</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
          >
            <Link to={t.to}>
              <Card className="group relative h-full overflow-hidden rounded-3xl border-border/60 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
                <div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                  style={{ background: t.gradient }}
                />
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-soft"
                  style={{ background: t.gradient }}
                >
                  <t.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <p className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-4 text-center text-xs text-muted-foreground">
        ⚠ AI-generated content may contain inaccuracies. Please verify important information before professional use.
      </p>
    </div>
  );
}
