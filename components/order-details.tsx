"use client";

import { AlertCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatOrderStatus,
  getOrderStatusVariant,
  shouldDisplayOrderStatus,
  type Order,
} from "@/lib/order";
import { formatPrice, formatProductName } from "@/lib/product";

type OrderDetailsProps = {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
};

function OrderDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-24" />
      </CardContent>
    </Card>
  );
}

export function OrderDetails({
  order,
  isLoading,
  error,
  emptyMessage = "Order not found.",
}: OrderDetailsProps) {
  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-4" />
            Something went wrong
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            Order not found
          </CardTitle>
          <CardDescription>{emptyMessage}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const showStatus = shouldDisplayOrderStatus(order.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              Order {order.id.slice(0, 8)}...
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {order.id}
            </CardDescription>
          </div>
          {showStatus && (
            <Badge variant={getOrderStatusVariant(order.status)}>
              {formatOrderStatus(order.status)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Products</p>
          <ul className="space-y-1">
            {order.products.map((productId) => (
              <li key={productId} className="text-sm">
                {formatProductName(productId)}
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  ({productId})
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
