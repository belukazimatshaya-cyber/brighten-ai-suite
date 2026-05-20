import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function TopBar() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <SidebarTrigger className="rounded-lg hover:bg-muted" />
      <div className="relative ml-2 hidden flex-1 max-w-md md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks, notes, emails…"
          className="h-10 rounded-xl border-border/60 bg-muted/40 pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={() => setDark((v) => !v)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="h-4 w-4" />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full"
            style={{ background: "var(--gradient-pink)" }}
          />
        </Button>
        <div className="ml-1 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-2 py-1 pr-3 shadow-card">
          <Avatar className="h-8 w-8">
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              AY
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-xs font-semibold">Alex Yuen</div>
            <div className="text-[10px] text-muted-foreground">Workspace owner</div>
          </div>
        </div>
      </div>
    </header>
  );
}
