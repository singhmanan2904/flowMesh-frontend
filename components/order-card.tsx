"use client";

import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatusProgress } from "@/components/order-status-progress";
import {
  getOrderProgress,
  getOrderStatusVariant,
  type Order,
} from "@/lib/order";
import { formatPrice, formatProductName } from "@/lib/product";

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const { statusLabel } = getOrderProgress(order.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">
              Order {order.id.slice(0, 8)}...
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {order.id}
            </CardDescription>
          </div>
          <Badge variant={getOrderStatusVariant(order.status)}>
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <OrderStatusProgress status={order.status} />

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              User ID
            </p>
            <p className="font-mono text-sm">{order.userId}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total amount
            </p>
            <p className="text-sm font-semibold">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Package className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium">
              Products ({order.products.length})
            </p>
          </div>
          <ul className="space-y-2 rounded-lg border bg-muted/30 p-3">
            {order.products.map((productId) => (
              <li
                key={productId}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span>{formatProductName(productId)}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {productId}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
