import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReferralFeeBottom = () => {
  return (
    <div className="space-y-4 py-6 px-5">
      <div className="flex gap-10">
        <div>
          <Label className="text-[#343A40] text-[16px] py-1 pl-2">Sort by</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Paid</SelectItem>
              <SelectItem value="dark">UnPaid</SelectItem>
              {/* <SelectItem value="system">i</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[#343A40] text-[16px] py-1 pl-2"> Choose Calendar</Label>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light"></SelectItem>
              <SelectItem value="dark"></SelectItem>
              <SelectItem value="system"></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#E6FAEE]">
              <TableHead className="text-center">Invoice</TableHead>
              <TableHead className="text-center">Billing Month</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Referral Fee (18%)</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            <TableRow className="hover:bg-muted/50">
              <TableCell>#12333</TableCell>
              <TableCell>
                <p>August 06,2025</p>
              </TableCell>
              <TableCell>
                <p>Unpaid</p>
              </TableCell>
              <TableCell>
                <p>$123</p>
              </TableCell>
              <TableCell className=" py-1">
                <Button className="bg-[#28A745] px-10 cursor-pointer">Pay</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-between px-10">
        <div className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalResults} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default ReferralFeeBottom;
