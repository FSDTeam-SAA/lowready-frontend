"use client";

import { useState } from "react";
// import { ConfirmBookingModal, BookingFormValues } from "@/components/ConfirmBookingModal";
import { Button } from "@/components/ui/button";
import { BookingFormValues, ConfirmBookingModal } from "../shared/ConfirmBookingModal";

export default function BookingPage() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleBookingSubmit(values: BookingFormValues) {
    console.log("Received Booking Data:", values);
    // TODO: send values to API
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Page</h1>
      <Button onClick={() => setModalOpen(true)}>Open Booking Modal</Button>

      <ConfirmBookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitBooking={handleBookingSubmit}
      />
    </div>
  );
}
