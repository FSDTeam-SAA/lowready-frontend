"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Lock, ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Drop this file in your Next.js App Router project, e.g.
 *   app/(auth)/unauthorized/page.tsx
 * Tailwind + shadcn/ui required. Animations: framer-motion, icons: lucide-react.
 */
export default function UnauthorizedPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reason =
    params?.get("reason") ?? "You don’t have permission to view this page.";

  // Fancy tilt based on pointer position
  const ref = React.useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set(px / 4);
    y.set(py / 4);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-background">
      {/* Animated gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -left-32 -top-28 h-80 w-80 rounded-full bg-gradient-to-tr from-pink-500/30 via-fuchsia-500/30 to-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-500/30 via-sky-500/30 to-violet-500/30 blur-3xl" />
      </div>

      {/* Subtle noise texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(black_1px,transparent_1px)] [background-size:6px_6px]" />

      {/* Glow grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_60%)]"
      >
        <div className="h-full w-full bg-[linear-gradient(var(--tw-gradient-stops))] from-transparent via-transparent to-transparent [background-image:repeating-linear-gradient(0deg,transparent,transparent_19px,theme(colors.slate.200/.08)_20px)]" />
      </div>

      <main className="container relative z-10 mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-6 py-16">
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY }}
          className="w-full"
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <Card className="relative overflow-hidden border-border/60 shadow-xl">
            {/* Diagonal sheen */}
            <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/5 to-white/0" />

            {/* Animated corner orbs */}
            <motion.span
              aria-hidden
              className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-fuchsia-500/30 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden
              className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-sky-500/30 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />

            <CardHeader className="flex flex-col items-center gap-2 pt-10 text-center sm:pt-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                className="relative"
              >
                <div className="absolute inset-0 -z-10 blur-xl">
                  <div className="mx-auto h-16 w-16 rounded-full bg-fuchsia-500/20" />
                </div>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
                  <Lock className="h-8 w-8" aria-hidden />
                </div>
              </motion.div>

              <CardTitle className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Access Denied
              </CardTitle>
              <p className="max-w-xl text-balance px-4 text-center text-sm text-muted-foreground sm:text-base">
                {reason}
              </p>
            </CardHeader>

            <CardContent className="pb-10">
              <div className="mx-auto flex max-w-md flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button variant="default" className="h-11" asChild>
                  <Link href="/login" prefetch>
                    <LogIn className="mr-2 h-4 w-4" /> Sign in
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="h-11"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go back
                </Button>
                <Button variant="ghost" className="h-11" asChild>
                  <Link href="/" prefetch>
                    <Home className="mr-2 h-4 w-4" /> Home
                  </Link>
                </Button>
              </div>

              {/* Helpful meta text */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                <kbd className="rounded-md border px-1.5 py-0.5 text-[10px]">
                  401/403
                </kbd>{" "}
                Unauthorized • If you believe this is a mistake, contact
                support.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        
      </main>
    </div>
  );
}
