"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/product";

const CART_STORAGE_KEY = "flowmesh_cart";

export function useCart() {
  const [cart, setCart] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored) as Product[]);
      } catch {
        setCart([]);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, isHydrated]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, product) => sum + product.price, 0),
    [cart]
  );

  const isInCart = useCallback(
    (productId: string) => cart.some((product) => product.id === productId),
    [cart]
  );

  const addToCart = useCallback((product: Product) => {
    setCart((prev) =>
      prev.some((item) => item.id === product.id) ? prev : [...prev, product]
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((product) => product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    cartTotal,
    isHydrated,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
