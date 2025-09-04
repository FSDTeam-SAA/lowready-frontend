// hooks/useSubscriptionStatus.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserData {
  isSubscriptionActive: boolean;
  subscriptionStatus: string;
  subscriptionEndDate: string;
  subscriptionPlan: string;
  subscriptionStartDate: string;
  // Add other fields as needed
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export const useSubscriptionStatus = () => {
  const { data: session, status } = useSession();
  const [isSubscriptionActive, setIsSubscriptionActive] = useState<
    boolean | null
  >(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUserSubscriptionStatus = async () => {
      // Don't fetch if session is still loading or user is not authenticated
      if (status !== "authenticated") {
        return;
      }

      setLoading(true);
      try {
        setError(null);

        const response = await fetch(`${baseUrl}/user/${session.user.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          
        });
          console.log(response)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          const subscriptionActive = data.data.isSubscriptionActive;
          setIsSubscriptionActive(subscriptionActive);

          // Show pricing modal if subscription is not active
          setShowPricingModal(!subscriptionActive);
        } else {
          throw new Error(data.message || "Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user subscription status:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        // Default to showing pricing modal on error
        setShowPricingModal(true);
        setIsSubscriptionActive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptionStatus();
  }, [session, status, baseUrl]);

  const closePricingModal = () => {
    setShowPricingModal(false);
  };

  const openPricingModal = () => {
    setShowPricingModal(true);
  };

  return {
    isSubscriptionActive,
    showPricingModal,
    loading,
    error,
    closePricingModal,
    openPricingModal,
    setShowPricingModal,
  };
};
