"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CreateBookingTour, Facility } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface FacilityTourProps {
  data: { data: Facility };
  facilityId: string;
}

// ✅ Validation schema
const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  relationship: z.string().min(1, "Please select a relationship"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  date: z.date().optional(),
  time: z.string().min(1, "Please select a time"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export function FacilityBooking({ data, facilityId }: FacilityTourProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // ✅ API mutation
  const tourCreateMutation = useMutation({
    mutationKey: ["create"],
    mutationFn: (formData: BookingFormData) => {
      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        relationWith: formData.relationship,
        message: formData.message,
        facility: facilityId,
        visitDate: formData.date?.toISOString().split("T")[0] || "",
        visitTime: formData.time,
      };
      return CreateBookingTour(payload);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const handleCreate = (formData: BookingFormData) => {
    tourCreateMutation.mutate(formData);
  };

  const datas = data?.data || [];

  return (
    <section className="">
      <div
        className="container mx-auto pt-[15px] md:pt-[30px] shadow-[10px] rounded-2xl p-[40px] bg-[#FFF] border-none"
        id="requestACall"
      >
        <h2 className="text-xl text-[32px] font-playfair font-semibold">
          Book a tour at
          <span className="text-[#28A745]"> Sunny Hills Assisted Living</span>
        </h2>
        <p>
          Schedule a visit today and experience the warm, welcoming environment
          of Sunny Hills Assisted Living firsthand.
        </p>

        <form onSubmit={handleSubmit(handleCreate)} className=" pt-[80px] mt-4">
          <div className="lg:flex justify-between gap-[80px]">
            {/* Left Column */}
            <div className="lg:w-1/2 mx-auto lg:mx-0">
              <div>
                <p className="pb-[16px] text-[20px] text-[#343A40] leading-[150%] font-semibold">
                  Select a Date:
                </p>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setValue("date", selectedDate);  
                  }}
                  className="rounded-md mx-auto lg:mx-0 shadow-[10px] w-full  md:w-1/2 lg:w-[100%] bg-[#F8F9FA]"
                  captionLayout="dropdown"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>

              <div className="pt-[24px]">
                <h2>Available Time</h2>
                <ul className="flex flex-wrap  gap-2">
                  {datas?.availableTime?.map((item: string, id: number) => (
                    <li
                      key={id}
                      onClick={() => {
                        setSelectedTime(item);  
                        setValue("time", item);  
                      }}
                      className={`px-5 py-2 w-[40%] md:w-[20%] cursor-pointer bg-[#F8F9FA] text-[#68706A] rounded-md
    hover:bg-[#28A745] hover:text-white
    ${item === selectedTime ? "bg-green-600 text-white" : ""}
    ${errors.time ? "border-2 border-red-500" : ""}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {errors.time && (
                  <p className="text-red-500 text-sm">{errors.time.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:w-1/2">
              <p className="text-[20px]  text-[#343A40] leading-[150%] pb-[40px] font-semibold">
                Your Information:
              </p>

              <div className="pb-[16px]">
                <label>Name</label>
                <Input
                  {...register("name")}
                  placeholder="Name"
                  className="border rounded-md p-2 mt-2 w-full"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="pb-4">
                <label>Email Address</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="border rounded-md p-2 mt-2 w-full"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="pb-4">
                <label>Phone Number</label>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="Phone"
                  className="border rounded-md p-2 mt-2 w-full"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="pb-4">
                <label>Relationship with Resident</label>
                {/* ✅ Fixed Shadcn Select */}
                <Select
                  onValueChange={(value) => setValue("relationship", value)}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className="text-red-500 text-sm">
                    {errors.relationship.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 pb-4">
                <label>Message</label>
                <Textarea
                  {...register("message")}
                  placeholder="Write your message"
                  className="border rounded-md p-2 mt-2 w-full"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* ✅ Submit Button with loading */}
              <Button
                type="submit"
                className="mt-8 w-full cursor-pointer"
                disabled={tourCreateMutation.isPending}
              >
                {tourCreateMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
