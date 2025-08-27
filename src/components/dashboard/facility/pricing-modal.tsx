"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, X } from "lucide-react"
import type { SubscriptionPlan } from "@/types/servicefacility"

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubscribe: (plan: SubscriptionPlan) => void
}

export function PricingModal({ open, onOpenChange, onSubscribe }: PricingModalProps) {
  const [isYearly, setIsYearly] = useState(false)

  const features = [
    { name: "Lorem Ipsum Lorem Ipsum Lorem", included: true },
    { name: "Lorem Ipsum Lorem Ipsum Lorem", included: true },
    { name: "Lorem Ipsum Lorem Ipsum Lorem", included: true },
    { name: "Lorem Ipsum Lorem Ipsum Lorem", included: false },
    { name: "Lorem Ipsum Lorem Ipsum Lorem", included: false },
  ]

  const handleSubscribe = () => {
    onSubscribe(isYearly ? "yearly" : "monthly")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-8 py-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Subscribe to Add and <span className="text-green-600">Manage Your Facilities.</span>
            </h2>
            <p className="text-gray-600 mb-8">
              Start your subscription today and easily list, update, and monitor your residential care facilities.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${!isYearly ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                Pay Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-green-600" />
              <span className={`text-sm ${isYearly ? "text-gray-900 font-medium" : "text-gray-600"}`}>Pay Yearly</span>
              {isYearly && (
                <div className="relative">
                  <div className="text-green-600 text-sm font-medium">Save 25%</div>
                  <div className="absolute -top-1 -right-8 w-16 h-8">
                    <svg viewBox="0 0 64 32" className="w-full h-full text-green-600 fill-current">
                      <path d="M20 8 Q 32 2, 44 8 Q 50 12, 44 16 Q 32 22, 20 16 Q 14 12, 20 8 Z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Card */}
            <div className="bg-green-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <p className="text-green-100 mb-6 text-sm">
                Ideal for individuals who who need advanced features and tools for client work
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${isYearly ? "19" : "25"}</span>
                <span className="text-green-100 ml-2">/ Month</span>
              </div>

              <Button
                onClick={handleSubscribe}
                className="w-full bg-white text-green-600 hover:bg-gray-50 font-medium mb-6"
              >
                Subscribe Now
              </Button>

              {/* Features */}
              <div className="space-y-3 text-left">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 border-2 border-green-300 rounded-full"></div>
                    )}
                    <span className={`text-sm ${feature.included ? "text-white" : "text-green-200"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
