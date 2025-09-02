// hooks/use-subscription-stats.ts
"use client";

import { fetchSubscription } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



// ✅ Custom hook to process subscription stats
export function useSubscriptionStats() {
  return useQuery({
    queryKey: ["subscription-stats"],
    queryFn: async () => {
      const data = await fetchSubscription();

      if (!data || !data.userId) return null;

      // Extract dates and status
      const startDate = new Date(data.userId.subscriptionStartDate);
      const endDate = new Date(data.userId.subscriptionEndDate);
      const isActive = data.userId.isSubscriptionActive;

      // Currency symbol
      const currencySymbol =
        data.currency === "usd" ? "$" : data.currency === "euro" ? "€" : "";

      // Billing cycle text
      const cycleText =
        data.billingCycle === "monthly" ? "/month" : "/year";

      // Days calculations
      const today = new Date();
      const totalDurationDays = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const remainingDays = Math.max(
        0,
        Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      );

      console.log(data)

      return {
        ...data,
        startDate,
        endDate,
        isActive,
        currencySymbol,
        cycleText,
        remainingDays,
        totalDurationDays,
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
