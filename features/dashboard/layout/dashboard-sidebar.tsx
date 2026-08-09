"use client"

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  ChevronsUpDown,
  Clock,
  Command,
  Compass,
  Home,
  LogOut,
  MoreHorizontal,
  Settings,
  Tag,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DashboardDivider,
  IconButton,
} from "@/features/dashboard/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutDialog } from "@/components/dashboard/logout-button";
import {
  dashboardColors,
  dashboardRadius,
  dashboardTransitions,
} from "@/features/dashboard/theme";

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Recent", href: "/dashboard/recent", icon: Clock },
  { label: "Collections", href: "/dashboard/collections", icon: Bookmark },
  { label: "Tags", href: "/dashboard/tags", icon: Tag },
  { label: "Explore", href: "/dashboard/explore", icon: Compass },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

const TAGS = [
  { label: "Work", count: 12 },
  { label: "Personal", count: 8 },
  { label: "Ideas", count: 5 },
] as const;

function SidebarSectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "px-3 pb-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase",
        dashboardColors.faint,
      )}
    >
      {children}
    </span>
  );
}

function SidebarItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}) {
  const pathname = usePathname();
  const active =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      data-slot="sidebar-item"
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex h-11 items-center gap-3 rounded-xl px-3 text-sm",
        dashboardTransitions.theme,
        active
          ? cn(dashboardColors.navActive, "font-medium")
          : cn(
              dashboardColors.navInactive,
              dashboardColors.navHover,
              "hover:text-[#e8edf5]",
            ),
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "size-[18px] shrink-0 transition-colors duration-200",
          active ? "text-white" : "opacity-75",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function WorkspaceSwitcher() {
  return (
    <div
      data-slot="workspace-switcher"
      className={cn(
        "flex h-14 cursor-default items-center gap-3 rounded-xl px-2.5",
        "bg-white/[0.03] ring-1 ring-white/[0.05]",
        dashboardColors.navHover,
      )}
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center",
          dashboardRadius.button,
          "bg-gradient-to-br from-[#2563eb]/35 to-[#2563eb]/5 text-[#7cb3ff]",
        )}
      >
        <Command aria-hidden className="size-[18px]" />
      </div>
      <div className="grid min-w-0 flex-1 gap-0.5">
        <span className={cn("truncate text-sm font-semibold", dashboardColors.heading)}>
          My Workspace
        </span>
        <span className={cn("truncate text-xs", dashboardColors.caption)}>
          Personal
        </span>
      </div>
      <ChevronsUpDown aria-hidden className="size-4 shrink-0 opacity-60" />
    </div>
  );
}

function UserFooter() {
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div data-slot="user-footer" className="flex h-12 items-center gap-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center ring-1 ring-white/[0.08]",
          dashboardRadius.button,
          "bg-gradient-to-br from-[#2563eb]/25 to-[#2563eb]/5",
          dashboardColors.heading,
        )}
      >
        <User aria-hidden className="size-4" />
      </div>
      <div className="grid min-w-0 flex-1 gap-0">
        <span className={cn("truncate text-sm font-medium", dashboardColors.heading)}>
          Dev User
        </span>
        <span className={cn("truncate text-xs", dashboardColors.caption)}>
          dev@snippetflow.local
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton aria-label="Account menu" className="size-8">
            <MoreHorizontal aria-hidden />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-40 border-white/[0.08] bg-[#141f30] text-[#e8edf5] ring-white/[0.1]"
        >
          <DropdownMenuItem asChild className="focus:bg-[#2563eb]/15 focus:text-[#f3f6fb]">
            <Link href="/dashboard/settings">
              <Settings aria-hidden className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/[0.06]" />
          <DropdownMenuItem
            variant="destructive"
            className="text-[#fb7185] data-[variant=destructive]:focus:bg-[#fb7185]/10 data-[variant=destructive]:focus:text-[#fb7185]"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut aria-hidden className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}

function DashboardSidebar({
  className,
  ...props
}: React.ComponentProps<"aside">) {
  return (
    <aside
      data-slot="dashboard-sidebar"
      className={cn(
        "flex h-full w-[270px] shrink-0 flex-col border-r border-white/[0.06]",
        "bg-[#0a111c]/60",
        className,
      )}
      {...props}
    >
      <div className="px-4 pt-6 pb-5">
        <WorkspaceSwitcher />
      </div>

      <nav
        className="flex flex-col gap-1.5 px-3"
        aria-label="Navigation"
      >
        <SidebarSectionLabel>Library</SidebarSectionLabel>
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <DashboardDivider className="mx-4 my-5" />

      <div className="flex flex-col gap-1.5 px-3">
        <SidebarSectionLabel>Tags</SidebarSectionLabel>
        {TAGS.map((tag) => (
          <div
            key={tag.label}
            className={cn(
              "flex h-10 cursor-default items-center gap-2.5 rounded-xl px-3 text-sm",
              dashboardColors.navInactive,
              dashboardColors.navHover,
              "hover:text-[#e8edf5]",
            )}
          >
            <Tag aria-hidden className="size-3.5 shrink-0 opacity-70" />
            <span className="truncate">{tag.label}</span>
            <span
              className={cn(
                "ml-auto text-xs tabular-nums",
                dashboardColors.caption,
              )}
            >
              {tag.count}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-auto border-t border-white/[0.06] p-4"
        aria-label="Account"
      >
        <UserFooter />
      </div>
    </aside>
  );
}

export { DashboardSidebar };
