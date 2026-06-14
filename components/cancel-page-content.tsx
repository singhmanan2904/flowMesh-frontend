"use client";

import { useSearchParams } from "next/navigation";
import { CircleX } from "lucide-react";
import { OrderDetails } from "@/components/order-details";
import { OrderPageShell } from "@/components/order-page-shell";
import { useOrders } from "@/hooks/use-orders";

export function CancelPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? undefined;
  const { order, isLoading, error } = useOrders(orderId);

  return (
    <OrderPageShell
      icon={<CircleX className="size-4 text-destructive" />}
      label="Payment cancelled"
      title="Checkout was not completed"
      description="You left checkout before completing payment. Here are the details for this order."
    >
      <OrderDetails
        order={order}
        isLoading={isLoading}
        error={error}
        emptyMessage="This order could not be found on your account."
      />
    </OrderPageShell>
  );
}
