"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TourRequest } from "@/lib/api";
import { Check, X } from "lucide-react";

interface TourDialogProps {
  booking: TourRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ToureDialog({ booking, open, onOpenChange }: TourDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-8 rounded-2xl">
        {booking ? (
          <>
            {/* Top avatar and name */}
            <div className="flex flex-col items-start text-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={booking.userId.avatar?.url || "/placeholder.svg"}
                  alt={booking.userId.firstName}
                />
                <AvatarFallback>
                  {booking.userId.firstName[0]}
                  {booking.userId.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info section */}
            <div className="mt-6 space-y-6 text-sm">
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{booking.userId.firstName} {booking.userId.lastName}</p>
              </div>

              <div>
                <h3 className="font-medium">Email</h3>
                <p>{booking.userId.email}</p>
              </div>

              <div>
                <h3 className="font-medium">Phone Number</h3>
                <p>{booking.phoneNumber}</p>
              </div>

              <div>
                <h3 className="font-medium">Location</h3>
                <p>{booking.facility.location}</p>
              </div>

              <div>
                <h3 className="font-medium">Message</h3>
                <p className="text-muted-foreground">{booking.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p>{new Date(booking.visitDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Booked Time</h3>
                  <p>{booking.visitTime}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Relationship with resident</h3>
                <p>{booking.relationWith}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                className="bg-green-100 text-green-700 hover:bg-green-200"
                size="icon"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                className="bg-red-100 text-red-700 hover:bg-red-200"
                size="icon"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">No booking selected</p>
        )}
      </DialogContent>
    </Dialog>
  );
}