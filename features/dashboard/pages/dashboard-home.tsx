import * as React from "react";

import { DashboardButton, SectionContainer } from "@/features/dashboard/ui";
import { WelcomeHeader } from "./welcome-header";
import { QuickActions } from "./quick-actions";
import { ContinueWorking } from "./continue-working";
import { RecentActivity } from "./recent-activity";
import { Collections } from "./collections";
import { HelpfulResources } from "./helpful-resources";

function DashboardHome() {
  return (
    <SectionContainer className="gap-8">
      <WelcomeHeader
        greeting="Welcome back, Dev User"
        description="Pick up where you left off or start something new."
        action={
          <DashboardButton>
            New Snippet
          </DashboardButton>
        }
      />
      <QuickActions />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <ContinueWorking />
        <RecentActivity />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Collections />
        <HelpfulResources />
      </div>
    </SectionContainer>
  );
}

export { DashboardHome };
