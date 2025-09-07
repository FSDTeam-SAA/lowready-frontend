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
import { getNotifications, clearAllNotifications } from "@/lib/api";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { NotificationsResponse } from "@/types/notifications";

export default function Notifications() {
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id || "";

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });

  // Clear all mutation
  const clearAllMutation = useMutation({
    mutationFn: () => clearAllNotifications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
    },
  });

  // Format time
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Apply filter with useMemo
  const filteredNotifications = useMemo(() => {
    if (!notifications?.data) return [];

    switch (filter) {
      case "unread":
        return notifications.data.filter((n) => !n.isViewed);
      case "read":
        return notifications.data.filter((n) => n.isViewed);
      case "properties-listing":
        return notifications.data.filter((n) => n.type === "visitBooking");
      case "properties-booking":
        return notifications.data.filter((n) => n.type === "booking");
      case "tour-booking":
        return notifications.data.filter((n) => n.type === "tour-booking");
      case "reviews-ratings":
        return notifications.data.filter(
          (n) => n.type === "visitBookingCompleted"
        );
      default:
        return notifications.data;
    }
  }, [notifications, filter]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading notifications</p>;
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
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {!notification.isViewed && (
                              <span className="bg-green-primary text-white text-xs rounded-full px-2 py-0.5">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm lg:text-[16px] text-[#68706A] font-normal">
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
                    <SelectValue placeholder="Select Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="properties-listing">
                      visitBooking
                    </SelectItem>
                    <SelectItem value="properties-booking">booking</SelectItem>
                    <SelectItem value="tour-booking">Tour Booking</SelectItem>
                    <SelectItem value="reviews-ratings">
                      visitBookingCompleted
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
                    clearAllMutation.isPending ||
                    notifications?.data.length === 0
                  }
                >
                  {clearAllMutation.isPending ? "Clearing..." : "Clear All"}
                </Button>
                <Button
                  className="bg-[#179649] hover:bg-green-secondary"
                  disabled={notifications?.data.length === 0}
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
