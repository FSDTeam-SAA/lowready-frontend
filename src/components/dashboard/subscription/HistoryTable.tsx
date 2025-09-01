// "use client"

// import React from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// // Future API data can populate this array
// const historyData = [
//   {
//     invoice: "#1234567",
//     billingMonth: "August, 2025",
//     type: "Monthly",
//     amount: "$123",
//     status: "Paid",
//   },
//   {
//     invoice: "#1234567",
//     billingMonth: "August, 2025",
//     type: "Yearly",
//     amount: "$123",
//     status: "Paid",
//   },
//   {
//     invoice: "#1234567",
//     billingMonth: "August, 2025",
//     type: "Yearly",
//     amount: "$123",
//     status: "Failed",
//   },
//   {
//     invoice: "#1234567",
//     billingMonth: "August, 2025",
//     type: "Yearly",
//     amount: "$123",
//     status: "Paid",
//   },
// ]

// const HistoryTable = () => {
//   return (
//     <div className="w-full px-3 mx-auto  mt-8">
//       <h2 className="text-3xl font-semibold mb-3">Subscription History</h2>
//       <p className="text-gray-500 mb-6 text-lg">
//         Stay updated with the latest alerts and messages.
//       </p>

//       <div className="rounded-md border mx-auto">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-green-50">
//               <TableHead className="text-lg font-semibold py-4">Invoice</TableHead>
//               <TableHead className="text-lg font-semibold py-4">Billing Month</TableHead>
//               <TableHead className="text-lg font-semibold py-4">Subscription Type</TableHead>
//               <TableHead className="text-lg font-semibold py-4">Amount</TableHead>
//               <TableHead className="text-lg font-semibold py-4">Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {historyData.map((item, index) => (
//               <TableRow key={index} className="h-20">
//                 <TableCell className="text-lg py-4">{item.invoice}</TableCell>
//                 <TableCell className="text-lg py-4">{item.billingMonth}</TableCell>
//                 <TableCell className="text-lg py-4">{item.type}</TableCell>
//                 <TableCell className="text-lg py-4">{item.amount}</TableCell>
//                 <TableCell className="text-lg py-4">
//                   <span
//                     className={`${
//                       item.status === "Paid"
//                         ? "text-green-600"
//                         : "text-red-600"
//                     } font-medium`}
//                   >
//                     {item.status}
//                   </span>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   )
// }

// export default HistoryTable

"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSubscriptionHistory } from "@/hooks/useSubscriptionHistory";
import { SubscriptionPayment } from "@/types/payment";

const HistoryTable = () => {
  const { data, isLoading, isError } = useSubscriptionHistory(1, 10);

  if (isLoading) {
    return <p className="text-center py-6">Loading...</p>;
  }

  if (isError) {
    return (
      <p className="text-center py-6 text-red-500">Failed to load data.</p>
    );
  }

  return (
    <div className="w-full px-3 mx-auto mt-8">
      <h2 className="text-3xl font-semibold mb-3">Subscription History</h2>
      <p className="text-gray-500 mb-6 text-lg">
        Stay updated with the latest alerts and messages.
      </p>

      <div className="rounded-md border mx-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50">
              <TableHead className="text-lg font-semibold py-4">
                Invoice
              </TableHead>
              <TableHead className="text-lg font-semibold py-4">
                Billing Month
              </TableHead>
              <TableHead className="text-lg font-semibold py-4">
                Subscription Type
              </TableHead>
              <TableHead className="text-lg font-semibold py-4">
                Amount
              </TableHead>
              <TableHead className="text-lg font-semibold py-4">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((item: SubscriptionPayment) => (
                <TableRow key={item._id} className="h-20">
                  <TableCell className="text-lg py-4">{`#${item._id.slice(
                    -7
                  )}`}</TableCell>
                  <TableCell className="text-lg py-4">
                    {format(new Date(item.createdAt), "MMMM, yyyy")}
                  </TableCell>
                  <TableCell className="text-lg py-4 capitalize">
                    {item.billingCycle}
                  </TableCell>
                  <TableCell className="text-lg py-4">
                    ${item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-lg py-4">
                    <span
                      className={`${
                        item.status === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No subscription history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoryTable;
