"use client";

import { CircleCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { OrderDetails } from "@/components/order-details";
import { OrderPageShell } from "@/components/order-page-shell";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";

export function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? undefined;
  const { order, isLoading, error } = useOrders(orderId);
  const { clearCart, isHydrated } = useCart();

  useEffect(() => {
    if (isHydrated) {
      clearCart();
    }
  }, [clearCart, isHydrated]);

  return (
    <OrderPageShell
      icon={<CircleCheck className="size-4 text-green-600" />}
      label="Payment successful"
      title="Thank you for your order"
      description="Your payment was received. Here are the details for your order."
    >
      <OrderDetails
        order={order}
        isLoading={isLoading}
        error={error}
        emptyMessage="Your payment was successful, but this order could not be found."
      />
    </OrderPageShell>
  );
}
