"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_LOGOUT_URL } from "@/lib/api";

export function ProtectedHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await fetch(AUTH_LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80"
        >
          <Package className="size-4 text-muted-foreground" />
          FlowMesh
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut data-icon="inline-start" />
          Log out
        </Button>
      </div>
    </header>
  );
}
