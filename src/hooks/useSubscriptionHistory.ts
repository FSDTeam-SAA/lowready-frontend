import { SubscriptionPayment } from "@/types/payment";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useSubscriptionHistory(page = 1, limit = 10) {
  const { data: session } = useSession();

  return useQuery<SubscriptionPayment[]>({
    queryKey: ["subscription-history", page, limit],
    queryFn: async () => {
      if (!session?.accessToken) throw new Error("Unauthorized");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/user/all?type=subscription&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch subscription history");

      const json = await res.json();
      return json.data as SubscriptionPayment[];
    },
    enabled: !!session?.accessToken,
  });
}
