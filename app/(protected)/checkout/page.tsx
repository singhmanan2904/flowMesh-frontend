"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutCart } from "@/components/checkout-cart";

export default function CheckoutPage() {
  return (
    <div className="min-h-full bg-muted/30">
      <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 space-y-4">
          <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Back to store
            </Link>
          </Button>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="size-4" />
              <span>Secure checkout</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground">
              Review your cart and complete your purchase.
            </p>
          </div>
        </section>

        <CheckoutCart />
      </main>
    </div>
  );
}
