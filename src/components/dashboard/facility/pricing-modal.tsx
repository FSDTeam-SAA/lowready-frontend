"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export interface SubscriptionPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: "monthly" | "yearly";
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe?: (plan: SubscriptionPlan) => void | Promise<void>;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const { data: session } = useSession();
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = session?.accessToken;

  // Fetch subscription plans when modal opens
  useEffect(() => {
    if (open && accessToken && baseUrl) {
      fetchSubscriptionPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accessToken, baseUrl]);

  const fetchSubscriptionPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/subscription/get`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<SubscriptionPlan[]> = await response.json();

      if (result.success && result.data.length > 0) {
        const activePlan = result.data.find((p) => p.isActive);
        setPlan(activePlan || result.data[0]); // Use first plan if no active plan found
      } else {
        setError("No subscription plans available");
      }
    } catch (err) {
      console.error("Error fetching subscription plans:", err);
      setError("Failed to load subscription plans. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!plan || !accessToken || !baseUrl) return;

    setIsSubscribing(true);
    setError(null);

    console.log(plan);
    try {
      const response = await fetch(`${baseUrl}/payment/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceId: plan._id,
          type: "subscription",
          billingCycle: "monthly",
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<{ sessionUrl: string }> = await response.json();

      if (result.success && result.data.sessionUrl) {
        // Redirect user to Stripe checkout
        window.location.href = result.data.sessionUrl;
      } else {
        throw new Error(result.message || "Failed to create checkout session");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process subscription. Please try again."
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getBillingText = (billingCycle: string) => {
    return billingCycle === "yearly" ? " /year" : "/ month";
  };

  // Don't render if no base URL or access token
  if (!baseUrl || !accessToken) {
    return null;
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-8 py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Loading subscription plans...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.18 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Plans
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={fetchSubscriptionPlans}
              className="bg-green-600 hover:bg-green-700"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!plan) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-8 py-12 text-center">
            <p className="text-gray-600">No subscription plans available.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl p-0 overflow-hidden">
        <div className="relative  ">
          <div className="px-8 py-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold font-playfair text-gray-900 mb-2">
                Subscribe to Add and{" "}
                <span className="text-green-600">Manage Your Facilities</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Start your subscription today and easily list, update, and
                monitor your residential care facilities.
              </p>
            </div>

            {/* Pricing Card */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.billingCycle === "yearly" && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                    Best Value
                  </span>
                )}
              </div>

              <p className="text-green-100 mb-6 text-sm">{plan.description}</p>

              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold">
                    {formatPrice(plan.price, plan.currency)}
                  </span>
                  <span className="text-green-100 text-sm">
                    {getBillingText(plan.billingCycle)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className="w-full bg-white cursor-pointer text-green-600 hover:bg-gray-50 font-medium mb-6 transition-colors disabled:opacity-50"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>

              {/* Features from API */}
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-medium text-green-100 mb-3">
                  What&apos;s included:
                </h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* <p className="text-xs text-gray-500 mt-4">
              Cancel anytime. No setup fees. Secure payment processing.
            </p> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
