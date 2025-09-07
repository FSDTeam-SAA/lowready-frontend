"use client";

import { createRenewSubscription } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

// Renew Subscription Hook
export function useRenewSubscription() {
  return useMutation({
    mutationFn: createRenewSubscription,
  });
}