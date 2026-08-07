import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
      <div className="flex w-full flex-col gap-8">
        <div className="grid gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="flex w-full flex-col gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-5">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-2 h-4 w-64" />
              <div className="mt-5 flex items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3.5 w-52" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
