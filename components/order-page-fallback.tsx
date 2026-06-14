import { Skeleton } from "@/components/ui/skeleton";

export function OrderPageFallback() {
  return (
    <div className="min-h-full bg-muted/30">
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="mb-4 h-8 w-32" />
        <Skeleton className="mb-2 h-10 w-64" />
        <Skeleton className="mb-8 h-5 w-96" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    </div>
  );
}
