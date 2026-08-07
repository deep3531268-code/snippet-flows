import {
  GridSkeleton,
  SectionHeaderSkeleton,
  ToolbarSkeleton,
} from "@/features/shared/components"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeaderSkeleton />
      <ToolbarSkeleton />
      <GridSkeleton count={6} label="Loading dashboard" />
    </div>
  )
}
