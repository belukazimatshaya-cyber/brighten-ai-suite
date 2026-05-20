import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Sparkles, Bell, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Aura" }] }),
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Personalize your Aura workspace."
        icon={<SettingsIcon className="h-6 w-6" />}
      />

      <div className="space-y-5">
        <Card className="rounded-3xl border-border/60 p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-4 w-4 text-primary" /> Profile
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input defaultValue="Alex Yuen" className="mt-1 h-11 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</Label>
              <Input defaultValue="Product Lead" className="mt-1 h-11 rounded-xl" />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </h3>
          {[
            { l: "Daily plan reminders", d: "Get nudged each morning with your top 3" },
            { l: "Meeting summary ready", d: "Notify when AI finishes a summary" },
            { l: "Weekly productivity digest", d: "Friday recap of your wins" },
          ].map((r) => (
            <div key={r.l} className="flex items-center justify-between border-t border-border/60 py-3 first:border-t-0">
              <div>
                <div className="text-sm font-semibold">{r.l}</div>
                <div className="text-xs text-muted-foreground">{r.d}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </Card>

        <Card className="rounded-3xl border-border/60 p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <Palette className="h-4 w-4 text-primary" /> Appearance
          </h3>
          <p className="text-sm text-muted-foreground">
            Use the moon icon in the top bar to switch between light and dark themes.
          </p>
        </Card>

        <Card
          className="rounded-3xl border-0 p-6 text-white shadow-glow"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h3 className="font-display text-lg font-bold">Responsible AI</h3>
          <p className="mt-2 text-sm text-white/90">
            AI-generated content may contain inaccuracies. Please verify important information before professional use.
          </p>
        </Card>
      </div>
    </div>
  );
}
