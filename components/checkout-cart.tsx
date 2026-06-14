"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatPrice, formatProductName, type Product } from "@/lib/product";

function CheckoutCartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Skeleton className="size-12 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
        <Separator />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-11 flex-1 rounded-lg" />
        <Skeleton className="h-11 w-28 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

export function CheckoutCart() {
  const { cart, cartTotal, isHydrated, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            products: cart.map((product: Product) => product.id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Failed to start checkout. Please try again.");
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      setError("Payment URL was not returned. Please try again.");
    } catch {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isHydrated) {
    return <CheckoutCartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="size-4" />
            Your cart is empty
          </CardTitle>
          <CardDescription>
            Add products from the store before checking out.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back to store
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="size-4" />
          Your cart
        </CardTitle>
        <CardDescription>
          {cart.length} {cart.length === 1 ? "item" : "items"} ready to checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {cart.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.imageUrl}
                  alt={formatProductName(product.id)}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {formatProductName(product.id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={isCheckingOut}
              onClick={() => removeFromCart(product.id)}
            >
              <Trash2 data-icon="inline-start" />
              Remove
            </Button>
          </div>
        ))}
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <Badge variant="secondary" className="text-base">
            {formatPrice(cartTotal)}
          </Badge>
        </div>
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="h-11 flex-1 text-base"
          size="lg"
          disabled={isCheckingOut}
          onClick={handleCheckout}
        >
          {isCheckingOut ? (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          ) : (
            <ShoppingBag data-icon="inline-start" />
          )}
          {isCheckingOut ? "Processing..." : "Pay now"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-11"
          disabled={isCheckingOut}
          onClick={clearCart}
        >
          Clear cart
        </Button>
      </CardFooter>
    </Card>
  );
}
