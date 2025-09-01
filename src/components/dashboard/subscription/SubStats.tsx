"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Clock, CreditCard } from "lucide-react";

const SubStats = () => {
  return (
    <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4   mx-auto">
      {/* Main Plan Card */}
      <Card className="w-full current-plan p-5 md:w-3/4 shadow-md rounded-xl">
        {/* Header */}
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
          <div className="flex items-center isActive gap-2 px-3 py-1 rounded-md bg-green-100 text-green-600 font-medium">
            <Check className="h-4 w-4" /> Active
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <p className="text-gray-500 price">
              <span className="text-4xl md:text-5xl font-bold text-gray-900">
                $123.99
              </span>
              <span className="text-lg">/month</span>
            </p>
            <CreditCard className="h-7 w-7 text-gray-400 hidden sm:block" />
          </div>

          {/* Valid Until & Next Renewal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Valid Until</p>
                <p className="font-semibold">August 14, 2025</p>
              </div>
            </div>
            <div className="border rounded-lg p-4 flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Next Renewal</p>
                <p className="font-semibold">August 14, 2025</p>
              </div>
            </div>
          </div>

          

          {/* Plan Features */}
          <div>
            <h3 className="font-medium text-lg mb-3">Plan Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Assisted Living",
                "Independent Living",
                "Independent Living",
                "Independent Living",
                "Independent Living",
                "Assisted Living",
                "Independent Living",
                "Independent Living",
                
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full border-red-500 text-red-500 hover:bg-red-200 "
          >
            Cancel Plan
          </Button>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Renew Now
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Stats Card */}
      <Card className="w-full p-5 md:w-1/4 h-fit shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg">Quick Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Days Reminders</span>
            <span className="font-bold">23 Days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Spent</span>
            <span className="font-bold">$123.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan Duration</span>
            <span className="font-bold">1 Month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubStats;
// 'use client'
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Check, Calendar, Clock, CreditCard, Loader2 } from "lucide-react";

// const SubStats = ({ baseUrl = process.env.NEXT_PUBLIC_API_URL }) => {
//   const [subscriptionData, setSubscriptionData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSubscriptionData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${baseUrl}/payment/user/all?type=subscription&page=1&limit=2`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               // Add authorization header if needed
//               // "Authorization": `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.success && data.data.length > 0) {
//           setSubscriptionData(data.data[0]); // Get the first subscription
//         } else {
//           setError("No subscription data found");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSubscriptionData();
//   }, [baseUrl]);

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Helper function to calculate days remaining
//   const getDaysRemaining = (endDate) => {
//     const today = new Date();
//     const end = new Date(endDate);
//     const diffTime = end - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   };

//   // Helper function to get plan duration
//   const getPlanDuration = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = end - start;
//     const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30));
//     return diffMonths === 1 ? "1 Month" : `${diffMonths} Months`;
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4 mx-auto">
//         <Card className="w-full p-5 md:w-3/4 shadow-md rounded-xl">
//           <CardContent className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
//             <span className="ml-2 text-gray-600">Loading subscription data...</span>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4 mx-auto">
//         <Card className="w-full p-5 md:w-3/4 shadow-md rounded-xl">
//           <CardContent className="flex items-center justify-center py-12">
//             <div className="text-center">
//               <p className="text-red-600 font-medium">Error loading subscription data</p>
//               <p className="text-gray-500 text-sm mt-1">{error}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!subscriptionData) {
//     return (
//       <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4 mx-auto">
//         <Card className="w-full p-5 md:w-3/4 shadow-md rounded-xl">
//           <CardContent className="flex items-center justify-center py-12">
//             <p className="text-gray-600">No subscription data available</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const user = subscriptionData.userId;
//   const facility = subscriptionData.referenceId;
//   const daysRemaining = getDaysRemaining(user.subscriptionEndDate);
//   const planDuration = getPlanDuration(user.subscriptionStartDate, user.subscriptionEndDate);

//   return (
//     <div className="flex flex-col justify-evenly md:flex-row gap-6 p-4 mx-auto">
//       {/* Main Plan Card */}
//       <Card className="w-full current-plan p-5 md:w-3/4 shadow-md rounded-xl">
//         {/* Header */}
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
//           <div className={`flex items-center gap-2 px-3 py-1 rounded-md font-medium ${
//             user.subscriptionStatus === 'active' 
//               ? 'bg-green-100 text-green-600' 
//               : 'bg-red-100 text-red-600'
//           }`}>
//             <Check className="h-4 w-4" /> 
//             {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Price Row */}
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
//             <p className="text-gray-500 price">
//               <span className="text-4xl md:text-5xl font-bold text-gray-900">
//                 ${subscriptionData.amount}
//               </span>
//               <span className="text-lg">/{facility.base}</span>
//             </p>
//             <CreditCard className="h-7 w-7 text-gray-400 hidden sm:block" />
//           </div>

//           {/* Valid Until & Next Renewal */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="border rounded-lg p-4 flex items-start gap-3">
//               <Calendar className="h-5 w-5 text-green-600 mt-1" />
//               <div>
//                 <p className="text-sm text-gray-500">Valid Until</p>
//                 <p className="font-semibold">{formatDate(user.subscriptionEndDate)}</p>
//               </div>
//             </div>
//             <div className="border rounded-lg p-4 flex items-start gap-3">
//               <Clock className="h-5 w-5 text-green-600 mt-1" />
//               <div>
//                 <p className="text-sm text-gray-500">Next Renewal</p>
//                 <p className="font-semibold">{formatDate(user.subscriptionEndDate)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Facility Information */}
//           <div>
//             <h3 className="font-medium text-lg mb-3">Facility Details</h3>
//             <div className="border rounded-lg p-4">
//               <h4 className="font-semibold text-gray-900">{facility.name}</h4>
//               <p className="text-gray-600 text-sm">{facility.address}</p>
//               <p className="text-gray-500 text-sm mt-1">{facility.description}</p>
//             </div>
//           </div>

//           {/* Plan Features */}
//           <div>
//             <h3 className="font-medium text-lg mb-3">Care Services</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {facility.careServices?.map((service, idx) => (
//                 <div key={idx} className="flex items-center gap-2 text-sm">
//                   <Check className="h-4 w-4 text-green-600" />
//                   {service}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Amenities */}
//           <div>
//             <h3 className="font-medium text-lg mb-3">Amenities</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               {facility.amenities?.map((amenity, idx) => (
//                 <div key={idx} className="flex items-center gap-2 text-sm">
//                   <Check className="h-4 w-4 text-green-600" />
//                   {amenity}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>

//         {/* Footer Buttons */}
//         <CardFooter className="grid grid-cols-1 mt-3 sm:grid-cols-2 gap-3">
//           <Button
//             variant="outline"
//             className="w-full border-red-500 text-red-500 hover:bg-red-200"
//           >
//             Cancel Plan
//           </Button>
//           <Button className="w-full bg-green-600 hover:bg-green-700">
//             Renew Now
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Quick Stats Card */}
//       <Card className="w-full p-5 md:w-1/4 h-fit shadow-md rounded-xl">
//         <CardHeader>
//           <CardTitle className="text-lg">Quick Status</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Days Remaining</span>
//             <span className="font-bold">{daysRemaining} Days</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Total Spent</span>
//             <span className="font-bold">${subscriptionData.amount}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Plan Duration</span>
//             <span className="font-bold">{planDuration}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Payment Status</span>
//             <span className={`font-bold capitalize ${
//               subscriptionData.status === 'paid' ? 'text-green-600' : 'text-red-600'
//             }`}>
//               {subscriptionData.status}
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SubStats;