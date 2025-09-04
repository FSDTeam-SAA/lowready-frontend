"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface BookingData {
  id: string;
  invoice: string;
  location: string;
  price: number;
  date: string;
  status: string;
  referralFee: number;
  referralPercentage: number;

  customer: {
    name: string;
    email: string;
    avatar: string;
  };

  images: {
    public_id: string;
    url: string;
    _id?: string;
  }[];

  residentInfo: {
    facilityName: string;
    bookedTime: string;
    specialNeeds: string;
  };

  bookerInfo: {
    fullName: string;
    relationToResident: string;
    phoneNumber: string;
    emailAddress: string;
  };

  bookingDetails: {
    facilityName: string;
    roomServiceType: string;
    admissionDate: string;
    durationOfStay: string;
    totalBill: number;
  };
}

interface BookingDetailsDialogProps {
  booking: BookingData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  if (!booking) return null;
  console.log("placement booking", booking);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Resident Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resident Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Name
                </h3>
                <p className="text-sm text-[#6C757D]" >{booking.residentInfo.facilityName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Date
                </h3>
                <p className="text-sm text-[#6C757D]" >24 February, 2025</p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Booked Time
                </h3>
                <p className="text-sm text-[#6C757D]" >{booking.residentInfo.bookedTime}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                Special Needs / Requirements
              </h3>
              <p className="text-sm text-[#6C757D]" >
                {booking.residentInfo.specialNeeds}
              </p>
            </div>

            <div>
              <h2 className="text-[16px] font-medium  text-[#343A40]  mb-1">View Attachments</h2>
              <div className="space-y-1">
                {booking.images.length > 0 ? (
                  booking.images.map((img) => (
                    <div
                      key={img._id}
                      className="flex justify-between items-center"
                    >
                      <p className="text-sm">{img.public_id}</p>
                      <Button
                        variant="ghost"
                        className="cursor-pointer text-green-500 hover:bg-white hover:text-green-600 rounded-b-none border-b"
                        onClick={() => window.open(img.url, "_blank")}
                      >
                        View
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6C757D]" >
                    No attachments
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booker Information */}
          <div className="space-y-1">
            <h2 className="text-xl text-[#434C45] font-semibold">Booker Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Full Name
                </h3>
                <p className="text-sm text-[#6C757D]" >{booking.bookerInfo.fullName}</p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Relation to Resident
                </h3>
                <p className="text-sm text-[#6C757D]" >
                  {booking.bookerInfo.relationToResident}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Phone Number
                </h3>
                <p className="text-sm">{booking.bookerInfo.phoneNumber}</p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Email Address
                </h3>
                <p className="text-sm text-[#6C757D]">{booking.bookerInfo.emailAddress}</p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Booker Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Facility Name
                </h3>
                <p className="text-sm text-[#6C757D]" >{booking.bookingDetails.facilityName}</p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Room / Service Type
                </h3>
                <p className="text-sm text-[#6C757D]">
                  {booking.bookingDetails.roomServiceType}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Admission Date
                </h3>
                <p className="text-sm text-[#6C757D]" >
                  {booking.bookingDetails.admissionDate}
                </p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Duration of Stay
                </h3>
                <p className="text-sm text-[#6C757D]" >
                  {booking.bookingDetails.durationOfStay}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Total Bill
                </h3>
                <p className="text-sm text-[#6C757D]" >
                  ${booking.bookingDetails.totalBill.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-[16px] font-medium  text-[#343A40]  mb-1">
                  Referral Fee
                </h3>
                <p className="text-sm text-[#6C757D]" >
                  ${booking.referralFee} ({booking.referralPercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
