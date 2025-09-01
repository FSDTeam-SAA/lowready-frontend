// components/shared/ConfirmBookingModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Plus, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { BookingType } from "@/lib/api";


// ✅ Validation schema
const bookingSchema = z.object({
  residentName: z.string().min(1, "Full Name is required"),
  dob: z.date("Date of Birth is required" ),
  gender: z.string().min(1, "Gender is required"),
  specialNeeds: z.string().optional(),
  medicalInfo: z.string().optional(),
  bookerName: z.string().min(1, "Full Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email"),
  facility: z.string().min(1, "Facility is required"),
  roomType: z.string().min(1, "Room type is required"),
  admissionDate: z.date( "Admission Date is required"),
  duration: z.string().min(1, "Duration is required"),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

type ConfirmBookingModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmitBooking?: (values: BookingType, isEdit: boolean) => void;
  apiData?: BookingType;
  isEdit?: boolean;
};

export function ConfirmBookingModal({
  open,
  onClose,
  onSubmitBooking,
  apiData,
  isEdit = false,
}: ConfirmBookingModalProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      residentName: "",
      dob: undefined,
      gender: "",
      specialNeeds: "",
      medicalInfo: "",
      bookerName: "",
      relation: "",
      phone: "",
      email: "",
      facility: "",
      roomType: "",
      admissionDate: undefined,
      duration: "",
    },
  });

  const [addperson, setAddPerson] = useState<number[]>([1]);

  // Reset form when apiData changes or modal opens/closes
  useEffect(() => {
    if (apiData) {
      form.reset({
        residentName: apiData?.residentialInfo?.[0]?.name || "",
        dob: apiData?.residentialInfo?.[0]?.dateOfBirth
          ? new Date(apiData.residentialInfo[0].dateOfBirth)
          : undefined,
        gender: apiData?.residentialInfo?.[0]?.gender || "",
        specialNeeds: apiData?.residentialInfo?.[0]?.requirements || "",
        medicalInfo: "",
        bookerName: "",
        relation: "",
        phone: "",
        email: "",
        facility: apiData?.facility || "",
        roomType: "",
        admissionDate: apiData?.startingDate
          ? new Date(apiData.startingDate)
          : undefined,
        duration: apiData?.duration?.toString() || "",
      });
    }
  }, [apiData, form, open]);

  function onSubmit(values: BookingFormValues) {
    // Transform back to API payload
    const payload: BookingType = {
      _id: isEdit ? apiData?._id : undefined,
      facility: values.facility,
      userId: apiData?.userId ?? "", 
      startingDate: values.admissionDate.toISOString(),
      duration: values.duration,
      paymentStatus: isEdit ? apiData?.paymentStatus || "pending" : "pending",
      residentialInfo: [
        {
          name: values.residentName,
          dateOfBirth: values.dob.toISOString().split("T")[0],
          gender: values.gender as "male" | "female" | "other",
          requirements: values.specialNeeds,
        },
      ],
      totalPrice: apiData?.totalPrice ?? 0,
    };

    onSubmitBooking?.(payload, isEdit);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Your Booking" : "Confirm Your Booking"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Update your booking details below." 
              : "Please review and complete your booking details below."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Resident Info */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg mb-2">
                  Resident Information
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    setAddPerson((prev) => [...prev, prev.length + 1])
                  }
                >
                  <Plus /> Add Person
                </Button>
              </div>
              {addperson.map((index) => (
                <div key={index}>
                  <div className="flex justify-end py-5">
                    {addperson.length > 1 && (
                      <Button
                        type="button"
                        className="py-5 "
                        onClick={() =>
                          setAddPerson((prev) =>
                            prev.filter((id) => id !== index)
                          )
                        }
                      >
                        <X />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 relative">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="residentName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date of Birth */}
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? format(field.value, "dd MMM, yyyy")
                                    : "Pick a date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender */}
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Special Needs */}
                    <FormField
                      control={form.control}
                      name="specialNeeds"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Special Needs / Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter requirements"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Medical Info */}
                    {/* <FormField
                      control={form.control}
                      name="medicalInfo"
                      render={({ field }) => (
                        <FormItem className="col-span-2 relative">
                          <FormLabel>Medical Information</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Upload or attach info"
                              {...field}
                            />
                          </FormControl>
                          <Paperclip className="absolute right-3 top-9 h-4 w-4 text-gray-400" />
                        </FormItem>
                      )}
                    /> */}
                  </div>
                </div>
              ))}
            </div>

            {/* Booker Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Booker Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bookerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation to Resident</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Daughter / Son / Other"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Info */}
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Booking Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter facility name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room / Service Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Private / Shared room..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admission Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? format(field.value, "dd MMM, yyyy")
                                : "Pick a date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration of Stay</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 6 Months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? "Update Booking" : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}