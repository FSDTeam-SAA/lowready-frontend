"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "@/lib/api";
import { useSession } from "next-auth/react";

const Notification = () => {
  // Local state for checkbox values
  const [checkedItems, setCheckedItems] = useState({
    properties: false,
    tour: false,
    reviews: false,
  });

  const session = useSession();
  //   console.log(session?.data?.);

  const id = session?.data?.user?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["notification"],
    queryFn: () => getNotifications(id),
  });

  const handleToggle = (key: keyof typeof checkedItems) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearAll = () => {
    setCheckedItems({
      properties: false,
      tour: false,
      reviews: false,
    });
  };

  const handleMarkAll = () => {
    setCheckedItems({
      properties: true,
      tour: true,
      reviews: true,
    });
  };

  if (isLoading) {
    return <div className="text-green-300 font-semibold text-xl pt-10 pl-10">Loading...</div>;
  } 

  const datas = data?.data || [];

  return (
    <section className="space-y-6 px-10 py-10">
      <div className="gap-6">
        {/* General notification section */}

        {datas.length === 0 ? (
          <div className="w-screen">
            <h2 className="text-2xl font-semibold w-full">You Have No Notification</h2>
          </div>
        ) : (
          <div>
            {datas.map((item: { id: string; message: string }) => (
              <div key={item.id} className="grid grid-cols-12 gap-6 mb-6">
                <Card className="col-span-12 lg:col-span-8 px-3">
                  <h2 className="text-[18px] font-semibold text-[#208436]">
                    Notifications
                  </h2>
                  <p className="text-[16px] font-normal leading-[150%] text-[#68706A] ">
                    {item.message}
                  </p>
                </Card>

                {/* Recent notifications */}
                <Card className="col-span-12 lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Filter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id="properties"
                          checked={checkedItems.properties}
                          onCheckedChange={() => handleToggle("properties")}
                        />
                        <span>Properties Booking</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id="tour"
                          checked={checkedItems.tour}
                          onCheckedChange={() => handleToggle("tour")}
                        />
                        <span>Tour Booking</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id="reviews"
                          checked={checkedItems.reviews}
                          onCheckedChange={() => handleToggle("reviews")}
                        />
                        <span>Reviews & Rating</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleClearAll}
                        className="border-red-500 w-1/2 text-red-500 rounded-2xl"
                      >
                        Clear All
                      </Button>
                      <Button
                        onClick={handleMarkAll}
                        className="bg-[#28A745] w-1/2 hover:bg-[#208436] text-white rounded-2xl"
                      >
                        Mark All Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notification;
