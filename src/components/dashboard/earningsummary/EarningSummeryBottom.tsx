import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import React from "react";

const EarningSummeryBottom = () => {
  return (
    <section className="px-5  py-[24px]">
      <div className="flex justify-between gap-5 ">
        <div className="w-1/2">
          <Card className="bg-white p-5 w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4 w-full">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Placements
              </CardTitle>
              <button className="text-green-600 text-sm font-medium hover:text-green-700">
                See all
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 gap-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        OR
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Olivia Rhye
                      </p>
                      <p className="text-xs text-gray-500">
                        example@example.com
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> 2715 Ash Dr, San Jose,
                      South Dakota
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      $2,000
                    </p>
                  </div>
                  <div className="">
                    <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-1/2">
          <Card className="bg-white p-5 w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4 w-full">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Referral Fee (18%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 gap-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        OR
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Olivia Rhye
                      </p>
                      <p className="text-xs text-gray-500">
                        example@example.com
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      $2,000
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">$2,000</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EarningSummeryBottom;
