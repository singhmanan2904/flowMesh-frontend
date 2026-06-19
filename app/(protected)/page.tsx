"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, ClipboardList, Package, ShoppingBag, ShoppingCart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { apiUrl } from "@/lib/api";
import {
  formatPrice,
  formatProductName,
  type Product,
} from "@/lib/product";

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden pt-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-24" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}

function ProductsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { cart, isInCart, addToCart, removeFromCart, isHydrated } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl("products"), {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setError("Failed to load products. Please try again later.");
          return;
        }

        const data = await response.json();
        setProducts(data.products ?? []);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-full bg-muted/30">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="size-4" />
              <span>FlowMesh Store</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Browse products
            </h1>
            <p className="max-w-xl text-muted-foreground">
              Discover items curated for your next order.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && !error && (
              <Badge variant="secondary" className="w-fit">
                {products.length} {products.length === 1 ? "item" : "items"}
              </Badge>
            )}
            {isHydrated && cart.length > 0 && (
              <Badge variant="outline" className="w-fit">
                {cart.length} in cart
              </Badge>
            )}
            <Button variant="outline" size="icon-lg" asChild>
              <Link href="/orders" aria-label="View orders">
                <ClipboardList />
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

        {!error && isLoading && <ProductsGridSkeleton />}

        {!error && !isLoading && products.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>No products yet</CardTitle>
              <CardDescription>
                Check back soon — new items are on the way.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {!error && !isLoading && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const inCart = isInCart(product.id);

              return (
                <Card
                  key={product.id}
                  className="overflow-hidden pt-0 transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.imageUrl}
                      alt={formatProductName(product.id)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{formatProductName(product.id)}</CardTitle>
                    <CardDescription className="font-mono text-xs uppercase tracking-wide">
                      {product.id}
                    </CardDescription>
                    <CardAction>
                      <Badge variant="secondary">
                        {formatPrice(product.price)}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button
                      className="h-11 flex-1 text-base"
                      size="lg"
                      disabled={inCart}
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingBag data-icon="inline-start" />
                      {inCart ? "Added to cart" : "Add to cart"}
                    </Button>
                    {inCart && (
                      <Button
                        variant="outline"
                        size="icon-lg"
                        className="h-11 shrink-0"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Remove ${formatProductName(product.id)} from cart`}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
