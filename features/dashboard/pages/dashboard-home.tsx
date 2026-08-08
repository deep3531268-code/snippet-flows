import * as React from "react";

import { DashboardButton, SectionContainer } from "@/features/dashboard/ui";
import { getDashboardData } from "../actions";
import { WelcomeHeader } from "./welcome-header";
import { DashboardStats } from "./dashboard-stats";
import { QuickActions } from "./quick-actions";
import { ContinueWorking } from "./continue-working";
import { RecentSnippets } from "./recent-snippets";
import { RecentActivity } from "./recent-activity";
import { Collections } from "./collections";
import { HelpfulResources } from "./helpful-resources";

async function DashboardHome() {
  const data = await getDashboardData();
  const featuredSnippet = data.recentSnippets[0] ?? null;

  return (
    <SectionContainer className="gap-8">
      <WelcomeHeader
        greeting={
          data.userName
            ? `Welcome back, ${data.userName}`
            : "Welcome back"
        }
        description="Pick up where you left off or start something new."
        action={
          <DashboardButton>
            New Snippet
          </DashboardButton>
        }
      />
      <DashboardStats stats={data.stats} />
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ContinueWorking snippet={featuredSnippet} />
        <RecentActivity activity={data.activity} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <RecentSnippets snippets={data.recentSnippets} />
        <Collections collections={data.recentCollections} />
      </div>
      <HelpfulResources />
    </SectionContainer>
  );
}

export { DashboardHome };
