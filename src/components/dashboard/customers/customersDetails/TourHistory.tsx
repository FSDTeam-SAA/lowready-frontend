import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const TourHistory = () => {
  return (
    <div>
      <h2>Tour History</h2>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#E6FAEE]">
            <TableHead>Place Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Scheduled Data</TableHead>
            <TableHead>Scheduled Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-muted/50">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium"></div>
                  <div className="text-sm text-muted-foreground"></div>
                </div>
              </div>
            </TableCell>
            <TableCell>North port Florida</TableCell>
            <TableCell>12/08/2025</TableCell>
            <TableCell>11:00 am</TableCell>
            <TableCell>
              <Button>Upcamming</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TourHistory;
