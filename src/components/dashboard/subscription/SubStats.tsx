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

const SubStats = () => {
  return (
    <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4   mx-auto">
      {/* Main Plan Card */}
      <Card className="w-full current-plan p-5 md:w-3/4 shadow-md rounded-xl">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
          <div className="flex items-center isActive gap-2 px-3 py-1 rounded-md bg-green-100 text-green-600 font-medium">
            <Check className="h-4 w-4" /> Active
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <p className="text-gray-500 price">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">
                $123.99
              </span>
              <span className="text-lg">/month</span>
            </p>
            <CreditCard className="h-7 w-7 text-gray-400 hidden sm:block" />
          </div>

          {/* Valid Until & Next Renewal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-semibold">August 14, 2025</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Next Renewal</p>
                <p className="font-semibold">August 14, 2025</p>
              </div>
            </div>
          </div>

          

          {/* Plan Features */}
          <div>
            <h3 className="font-medium text-lg mb-3">Plan Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Assisted Living",
                "Independent Living",
                "Independent Living",
                "Independent Living",
                "Independent Living",
                "Assisted Living",
                "Independent Living",
                "Independent Living",
                
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-200 "
          >
            Cancel Plan
          </Button>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Renew Now
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Stats Card */}
      <Card className="w-full p-5 md:w-1/4 h-fit shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Quick Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Days Reminders</span>
            <span className="font-bold">23 Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Spent</span>
            <span className="font-bold">$123.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan Duration</span>
            <span className="font-bold">1 Month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubStats;
