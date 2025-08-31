"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, clearAllNotifications, markNotificationAsRead } from "@/lib/api";
import { useSession } from "next-auth/react";

import { formatDistanceToNow } from "date-fns";
import { INotification } from "@/types/notifications";


export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id || "";

  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery<INotification[]>({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId, // Only run query if userId exists
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  // Clear all mutation
  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  // Filter notifications based on selection
  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((notification) => notification.type === filter);
  }, [notifications, filter]);

  // Format time using date-fns
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <div className="flex-1">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-500">Error loading notifications</p>
              <p className="text-gray-600 text-sm mt-2">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-start mx-auto">
           

            {/* Notifications List */}
            <div className="space-y-4 w-[70%]">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No notifications found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification._id}
                    className={
                      notification.isViewed
                        ? "opacity-70"
                        : "border-green-primary border"
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#208436] text-[18px] capitalize">
                              {notification.type.replace("-", " ")}
                            </h3>
                            {!notification.isViewed && (
                              <span className="bg-green-primary text-white text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm lg-[16px] text-[#68706A] font-normal mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs font-normal text-gray-500 whitespace-nowrap ml-4">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* notification side list  */}
            <div className="flex flex-col gap-10 justify-between items-center mb-6 w-[25%]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Filter</span>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="properties-listing">
                      Properties Listing
                    </SelectItem>
                    <SelectItem value="properties-booking">
                      Properties Booking
                    </SelectItem>
                    <SelectItem value="tour-booking">Tour Booking</SelectItem>
                    <SelectItem value="reviews-ratings">
                      Reviews & Ratings
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="text-red-error border-red-error hover:bg-red-bg bg-transparent"
                  onClick={() => clearAllMutation.mutate()}
                  disabled={
                    clearAllMutation.isPending || notifications.length === 0
                  }
                >
                  {clearAllMutation.isPending ? "Clearing..." : "Clear All"}
                </Button>
                <Button
                  className="bg-[#179649] hover:bg-green-secondary"
                  disabled={notifications.length === 0}
                >
                  Mark as Read
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
