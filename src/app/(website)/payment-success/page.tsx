"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />

        {/* Title */}
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful 🎉
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-gray-600">
          Your subscription has been renewed successfully.  
          Thank you for staying with us!
        </p>

        {/* Action Button */}
        <div className="mt-6">
          <Link href="/dashboard">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
