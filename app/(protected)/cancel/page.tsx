import { Suspense } from "react";
import { CancelPageContent } from "@/components/cancel-page-content";
import { OrderPageFallback } from "@/components/order-page-fallback";

export default function CancelPage() {
  return (
    <Suspense fallback={<OrderPageFallback />}>
      <CancelPageContent />
    </Suspense>
  );
}
