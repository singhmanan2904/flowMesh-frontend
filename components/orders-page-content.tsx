"use client";

import Link from "next/link";
import {
  AlertCircle,
  ClipboardList,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderCard } from "@/components/order-card";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";

function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <div className="space-y-3 px-6 pb-6">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export function OrdersPageContent() {
  const { orders, isLoading, error } = useOrders();
  const { cart, isHydrated } = useCart();

  return (
    <div className="min-h-full bg-muted/30">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardList className="size-4" />
              <span>Order history</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Your orders
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Track payment, shipping, and delivery for every order you&apos;ve
              placed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && !error && orders.length > 0 && (
              <Badge variant="secondary" className="w-fit">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </Badge>
            )}
            {isHydrated && cart.length > 0 && (
              <Badge variant="outline" className="w-fit">
                {cart.length} in cart
              </Badge>
            )}
            <Button variant="outline" size="icon-lg" asChild>
              <Link href="/" aria-label="Back to store">
                <Package />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              className="relative"
              asChild
            >
              <Link href="/checkout" aria-label="Go to checkout">
                <ShoppingCart />
                {isHydrated && cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {cart.length}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </section>

        {isLoading && <OrdersListSkeleton />}

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="size-4" />
                Something went wrong
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4" />
                No orders yet
              </CardTitle>
              <CardDescription>
                When you place an order, it will show up here with live status
                updates.
              </CardDescription>
            </CardHeader>
            <div className="px-6 pb-6">
              <Button asChild>
                <Link href="/">Browse products</Link>
              </Button>
            </div>
          </Card>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
