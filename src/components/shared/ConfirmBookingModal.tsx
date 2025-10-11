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
// import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {  useEffect } from "react";
import { BookingType } from "@/lib/api";

// ✅ Validation schema
const bookingSchema = z.object({
  residentName: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  specialNeeds: z.string().optional(),
  medicalInfo: z.string().optional(),
  bookerName: z.string().min(1, "Full Name is required"),
  relation: z.string().min(1, "Relation is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email"),
  facility: z.string().min(1, "Facility is required"),
  roomType: z.string().min(1, "Room type is required"),
  serviceType:z.string().optional(),
  admissionDate: z.date("Admission Date is required"),
  duration: z.string().optional(),
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
      serviceType:"",
      admissionDate: undefined,
      duration: "",
    },
  });

  // const [addperson, setAddPerson] = useState<number[]>([1]);

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
      duration: values?.duration || '',
      roomType:values.roomType,
      serviceType:values.serviceType || '',
      paymentStatus: isEdit ? apiData?.paymentStatus || "pending" : "pending",
      residentialInfo: [
        {
          name: values?.residentName || '',
          dateOfBirth: values?.dob?.toISOString().split("T")[0] || '',
          gender: values.gender as "male" | "female" | "other",
          requirements: values.specialNeeds,
        },
      ],
      totalPrice:
        apiData?.totalPrice && apiData?.duration
          ? apiData.totalPrice * Number(apiData.duration)
          : 0,
    };

    onSubmitBooking?.(payload, isEdit);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto  !p-0">
        <DialogHeader
          className=" p-4 py-8 text-white"
          style={{
            background:
              "linear-gradient(282deg, rgba(40, 167, 69, 0.80) -0.29%, #51B8A0 48.99%, #6DBC8B 101.56%)",
          }}
        >
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? "Edit Your Booking" : "Confirm Your Booking"}
          </DialogTitle>
          <DialogDescription className="text-white/90">
            {isEdit
              ? "Update your booking details below."
              : "Please review and complete your booking details below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 p-6"
          >
            
            {/* <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[20px] text-[#434C45] mb-2">
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
               
                    <FormField
                      control={form.control}
                      name="residentName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                 
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                            Gender
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                             
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  
                    <FormField
                      control={form.control}
                      name="specialNeeds"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                            Special Needs / Requirements
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter requirements"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                   
                  </div>
                </div>
              ))}
            </div> */}

            {/* Booker Info */}
            <div>
              <h3 className="font-semibold text-[20px] text-[#434C45] mb-2">
                Your Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bookerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Full Name
                      </FormLabel>
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
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Relation to Resident
                      </FormLabel>
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
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Phone Number
                      </FormLabel>
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
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Email Address
                      </FormLabel>
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
              <h3 className="font-semibold text-[20px] text-[#434C45] mb-2">
                Booking Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* <FormField
                  control={form.control}
                  name="facility"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Facility Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter facility name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Room
                      </FormLabel>
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
                /> */}

                <FormField
                  control={form.control}
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Room Type
                      </FormLabel>
                      {/* <FormControl> */}
                      <FormControl>
                        <select
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          {/* <option value="">Select Room</option> */}
                          <option value="Private Room">Private Room</option>
                          <option value="Shared Room">Shared Room</option>
                          {/* <option value="other">Other</option> */}
                        </select>
                      </FormControl>
                      {/* <Input
                          placeholder="Private / Shared room..."
                          {...field}
                        /> */}
                      {/* </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Service Type
                      </FormLabel>
                      {/* <FormControl> */}
                      <FormControl>
                        <select
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select Service</option>
                          <option value="Supervisory Care">
                            Supervisory Care
                          </option>
                          <option value="Directed Care">Directed Care</option>
                          <option value="Personal Care">Personal Care</option>
                          <option value=" Memory Care"> Memory Care</option>
                          <option value="Respite Care">Respite Care</option>
                        </select>
                      </FormControl>
                      {/* <Input
                          placeholder="Private / Shared room..."
                          {...field}
                        /> */}
                      {/* </FormControl> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admissionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Tour Date
                      </FormLabel>
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
                {/* <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#434C45] font-medium leading-[150%]">
                        Duration of Stay
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 6 Months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
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
