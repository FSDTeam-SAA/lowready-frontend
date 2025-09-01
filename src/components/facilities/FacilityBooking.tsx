// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ConfirmBookingModal } from "../shared/ConfirmBookingModal";

// export function BookingPage() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold">Book a Facility</h1>
//       <p className="mb-4 text-gray-500">Click below to start your booking.</p>

//       <Button onClick={() => setIsModalOpen(true)}>Book Now</Button>

//       {/* ✅ Use modal */}
//       <ConfirmBookingModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//       />
//     </div>
//   );
// }
