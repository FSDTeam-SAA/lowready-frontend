"use client";
import { Button } from "@/components/ui/button";

export function FacilityBooking() {
  return (
    <section className="my-6">
      <h2 className="text-xl font-semibold">
        Book a tour at
        <span className="text-green-400"> Sunny Hills Assisted Living</span>
      </h2>
      <p>
        Schedule a visit today and experience the warm, welcoming environment of
        Sunny Hills Assisted Living firsthand.
      </p>
      <div className="grid grid-cols-2  pt-[80px] gap-6 mt-4">
        <div>
          <div>
            <p>Select a Date:</p>
            <input type="date" className="border rounded-md p-2 mt-2 w-full" />
          </div>
          <div className="pt-[24px]">
            <h2>Available Time</h2>
            <div>
              <Button className="">12-00 PM</Button>
            </div>
          </div>
        </div>
        <div>
          <p>Your Information:</p>
          <div>
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="Name"
              className="border rounded-md p-2 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Email Addres</label>
            <input
              type="email"
              placeholder="Email"
              className="border rounded-md p-2 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Phone Number</label>
            <input
              type="tel"
              placeholder="Phone"
              className="border rounded-md p-2 mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="">Relationship with Resident</label>
            <section className="border rounded-md p-2 mt-2 w-full">
              <option value="">open</option>
            </section>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Message</label>
            <textarea placeholder="Write your message" className="h-8" />
          </div>
          <Button className="mt-4 w-full">Submit</Button>
        </div>
      </div>
    </section>
  );
}
