"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Clock, CreditCard } from "lucide-react";
import { useSubscriptionStats } from "@/hooks/useSubscriptionStats";
import { useRenewSubscription } from "@/hooks/use-renewSubscription";
import Link from "next/link";

const SubStats = () => {
  const { data, isLoading, isError } = useSubscriptionStats();
  const { mutate: renewNow, isPending } = useRenewSubscription();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Failed to load subscription details.</p>;

  const {
    amount,
    startDate,
    endDate,
    isActive,
    currencySymbol,
    cycleText,
    remainingDays,
    totalDurationDays,
    isSubscriptionActive,
  } = data;

  // Renew Subscription Handler
  const handleRenewNow = () => {
    renewNow(undefined, {
      onSuccess: (res) => {
        console.log("Renew Success ✅", res);

        if (res?.data?.sessionUrl) {
          window.location.href = res.data.sessionUrl;
        } else {
          alert("Subscription renewed successfully!");
        }
      },
      onError: (err) => {
        console.error("Renew Failed ❌", err);
        alert("Failed to renew subscription.");
      },
    });
  };

  return (
    <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4 mx-auto">
      {isSubscriptionActive ? (
        <>
          <Card className="w-full current-plan p-5 md:w-3/4 shadow-md rounded-xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-md font-medium ${
                  isActive
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Check className="h-4 w-4" /> {isActive ? "Active" : "Inactive"}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <p className="text-gray-500 price">
                  <span className="text-4xl md:text-5xl amount font-bold text-gray-900">
                    {currencySymbol} {amount}
                  </span>
                  <span className="text-lg">{cycleText}</span>
                </p>
                <CreditCard className="h-7 w-7 text-gray-400 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold">
                      {startDate
                        ? startDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No date"}
                    </p>
                  </div>
                </div>
                <div className="border rounded-lg p-4 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold">
                      {endDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Plan Features */}
              {/* <div>
            <h3 className="font-medium text-lg mb-3">Plan Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Assisted Living",
                "Independent Living",
                "Independent Living",
                "Independent Living",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div> */}
            </CardContent>

            <CardFooter className="grid grid-cols-1 mt-3 sm:grid-cols-2 justify-between gap-3">
              <div className=""></div>
              <Button
                onClick={handleRenewNow}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isPending ? "Processing..." : "Renew Now"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full p-5 md:w-1/4 h-fit shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Quick Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Days Reminder</span>
                <span className="font-bold">{remainingDays} Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Spent</span>
                <span className="font-bold">
                  {currencySymbol} {amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan Duration</span>
                <span className="font-bold">{totalDurationDays} Days</span>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="">
         <h2 className="text-red-300 text-3xl font-semibold"> Subscription is inactive</h2>
          <p className="text-center mt-2">
            Click{" "}
            <Link href={"/dashboard/facility"} className="underline hover:text-blue-400">here</Link>{" "}
            to Renew Subscription{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubStats;
