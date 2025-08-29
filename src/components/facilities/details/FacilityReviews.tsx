"use client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function FacilityReviews() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [email, setEmail] = useState("");

  const reviews = [
    {
      name: "Jane Doe",
      location: "Portland, OR",
      comment:
        "I've been ordering from TABLEFRESH for over a year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family.",
      rating: 5,
    },
    {
      name: "John Smith",
      location: "Portland, OR",
      comment:
        "I've been ordering from TABLEFRESH for over a year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family.",
      rating: 4,
    },
    {
      name: "Mary Johnson",
      location: "Portland, OR",
      comment:
        "I've been ordering from TABLEFRESH for over a year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family.",
      rating: 5,
    },
    {
      name: "Robert Brown",
      location: "Portland, OR",
      comment:
        "I've been ordering from TABLEFRESH for over a year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family.",
      rating: 5,
    },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ rating, reviewText, email });
    // Reset form
    setRating(0);
    setReviewText("");
    setEmail("");
  };

  return (
    <section className="my-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">
        What Families Say About Us
      </h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Harness experiences and heartfelt stories from residents and their loved
        ones.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Reviews Column */}
        <div className="space-y-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="border border-gray-200 p-6 rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">Connect Directly</h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < r.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">- {r.location}</p>
              <p className="text-gray-700 italic">{r.comment}</p>
              <p className="mt-4 font-medium">{r.name}</p>
            </div>
          ))}
        </div>

        {/* Form Column */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
          <div className="flex gap-3 items-start">
            <form onSubmit={handleSubmitReview}>
              <h3 className="text-xl font-semibold mb-6">Reviews Forms</h3>
              <div className="mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    How happy are you with our service
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className="focus:outline-none"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || rating)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </form>
            <div>
              <p className="flex gap-2">
                <Star
                  className={`w-4 h-4 text-yellow-500 fill-yellow-500
                           
                        `}
                />
                <Star
                  className={`w-4 h-4 text-yellow-500 fill-yellow-500
                           
                        `}
                />
                <Star
                  className={`w-4 h-4 text-yellow-500 fill-yellow-500
                           
                        `}
                />
                <span>4.9</span>
              </p>
              <p>Based on 2,529 reviews</p>
              <div></div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t flex gap-3 items-center border-gray-200">
            <div className="w-1/2">
              <Image
                src={"/map.png"}
                alt="map"
                className="w-[200px] aspect-auto object-cover h-[200px] lg:w-[344px] lg:h-[400px]"
                width={100}
                height={100}
              />
            </div>
            <div className="w-1/2">
              <h3 className="text-xl font-semibold mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-4">
                Find all the ways to reach us, including email, phone, and our
                office address, so you can get the support easily.
              </p>

              <div className="space-y-2">
                <p className="text-blue-600">
                  <a
                    href="mailto:support@dihuLacem.org"
                    className="hover:underline"
                  >
                    support@dihuLacem.org
                  </a>
                </p>
                <p className="text-gray-700">+1 (556) 128-4567</p>
                <p className="text-gray-700">
                  123 Cara Street, City, State, ZIP Address: 123 Cara Street
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
