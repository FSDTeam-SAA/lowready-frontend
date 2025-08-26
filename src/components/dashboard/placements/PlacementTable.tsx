"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchBookings, type BookingData } from "@/lib/api"
import { BookingDetailsDialog } from "./PlacementDialog"


export function BookingsTable() {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings", currentPage, itemsPerPage],
    queryFn: () => fetchBookings(currentPage, itemsPerPage),
  })

  const bookings = data?.data || []
  const totalPages = data?.totalPages || 0
  const totalResults = data?.total || 0

  const handleDetailsClick = (booking: BookingData) => {
    setSelectedBooking(booking)
    setDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error loading bookings</div>
      </div>
    )
  }

 

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-medium">Invoice</TableHead>
              <TableHead className="font-medium">Customer</TableHead>
              <TableHead className="font-medium">Location</TableHead>
              <TableHead className="font-medium">Price</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Referral Fee (18%)</TableHead>
              <TableHead className="font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/50">
                <TableCell className="font-medium text-muted-foreground">{booking.invoice}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} alt={booking.customer.name} />
                      <AvatarFallback>
                        {booking.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.customer.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{booking.location}</TableCell>
                <TableCell className="font-medium">${booking.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking.status === "Paid" ? "default" : "destructive"}
                    className={
                      booking.status === "Paid"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{booking.date}</TableCell>
                <TableCell className="font-medium">
                  {booking.status === "Cancelled" ? "-" : `$${booking.referralFee}`}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDetailsClick(booking)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalResults)} of{" "}
          {totalResults} results
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
      </div>

      <BookingDetailsDialog booking={selectedBooking} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
