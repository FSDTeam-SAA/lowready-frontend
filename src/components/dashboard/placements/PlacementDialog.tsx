"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
// import { X } from "lucide-react"
import type { BookingData } from "@/lib/api"

interface BookingDetailsDialogProps {
  booking: BookingData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailsDialog({ booking, open, onOpenChange }: BookingDetailsDialogProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Resident Information</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6">
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resident Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                <p className="text-sm">{booking.residentInfo.facilityName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Booked Time</h3>
                <p className="text-sm">{booking.residentInfo.bookedTime}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                <p className="text-sm">24 February, 2025</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Special Needs / Requirements</h3>
              <p className="text-sm text-muted-foreground">{booking.residentInfo.specialNeeds}</p>
            </div>
          </div>

          {/* Booker Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Booker Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                <p className="text-sm">{booking.bookerInfo.fullName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Relation to Resident</h3>
                <p className="text-sm">{booking.bookerInfo.relationToResident}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h3>
                <p className="text-sm">{booking.bookerInfo.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
                <p className="text-sm">{booking.bookerInfo.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Booker Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Facility Name</h3>
                <p className="text-sm">{booking.bookingDetails.facilityName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Room / Service Type</h3>
                <p className="text-sm">{booking.bookingDetails.roomServiceType}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Admission Date</h3>
                <p className="text-sm">{booking.bookingDetails.admissionDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration of Stay</h3>
                <p className="text-sm">{booking.bookingDetails.durationOfStay}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Bill</h3>
                <p className="text-sm">${booking.bookingDetails.totalBill.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Referral Fee</h3>
                <p className="text-sm">
                  ${booking.referralFee} ({booking.referralPercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
