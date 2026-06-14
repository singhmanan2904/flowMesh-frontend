import { Suspense } from "react";
import { OrderPageFallback } from "@/components/order-page-fallback";
import { SuccessPageContent } from "@/components/success-page-content";

export default function SuccessPage() {
  return (
    <Suspense fallback={<OrderPageFallback />}>
      <SuccessPageContent />
    </Suspense>
  );
}
