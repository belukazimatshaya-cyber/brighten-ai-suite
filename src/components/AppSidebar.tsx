import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarCheck,
  Sparkles,
  MessageCircle,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Notes", url: "/meetings", icon: FileText },
  { title: "Task Planner", url: "/tasks", icon: CalendarCheck },
  { title: "Research", url: "/research", icon: Sparkles },
  { title: "AI Chat", url: "/chat", icon: MessageCircle },
];

const bottomItems = [{ title: "Settings", url: "/settings", icon: Settings }];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (path: string) => (path === "/" ? currentPath === "/" : currentPath.startsWith(path));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div
        className="flex h-full flex-col"
        style={{ background: "var(--gradient-sidebar)" }}
      >
        <SidebarHeader className="px-4 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-glow"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="font-display text-lg font-bold text-sidebar-foreground">Aura</div>
                <div className="text-[11px] text-sidebar-foreground/60">AI Workplace</div>
              </div>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/50">
                Workspace
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={`h-11 rounded-xl text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground ${
                          active
                            ? "bg-sidebar-accent text-sidebar-foreground shadow-soft"
                            : ""
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-[18px] w-[18px] shrink-0" />
                          {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                          {active && !collapsed && (
                            <span
                              className="ml-auto h-1.5 w-1.5 rounded-full"
                              style={{ background: "var(--gradient-pink)" }}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-2 pb-4">
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  className="h-11 rounded-xl text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {!collapsed && (
            <div
              className="mt-3 rounded-2xl p-3 text-xs text-sidebar-foreground/80"
              style={{ background: "oklch(1 0 0 / 0.06)" }}
            >
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-sidebar-foreground">
                <Sparkles className="h-3 w-3" /> Pro tip
              </div>
              AI content may contain inaccuracies. Verify before sending.
            </div>
          )}
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
