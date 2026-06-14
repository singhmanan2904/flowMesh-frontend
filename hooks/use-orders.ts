"use client";

import { useEffect, useMemo, useState } from "react";
import type { Order } from "@/lib/order";

export function useOrders(orderId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          setError("Failed to load your orders. Please try again later.");
          return;
        }

        const data = await response.json();
        setOrders(data.orders ?? []);
      } catch {
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const order = useMemo(() => {
    if (!orderId) return null;
    return orders.find((item) => item.id === orderId) ?? null;
  }, [orders, orderId]);

  return { orders, order, isLoading, error };
}
