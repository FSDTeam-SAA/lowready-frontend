// API configuration and types
import axios from "axios";

import { getSession } from "next-auth/react";


// import { config } from "process";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

//create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});
//add request interceptor to access token form next-auth session

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `${session.accessToken}`;
    } else {
      console.warn("no token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Get All Blogs with pagination
export async function getAllBlogsPagination(page: number, limit: number) {
  const res = await api.get(`/blog/all?page=${page}&limit=${limit}`);
  return res.data;
}

// Get Single Blog or Blog details
export async function getSingleBlog(id: string) {
  const res = await api.get(`/blog/${id}`);
  return res.data;
}


//test api call to fetch bookings

// API functions for booking management
export interface BookingData {
  id: string
  invoice: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  location: string
  price: number
  status: "Paid" | "Cancelled"
  date: string
  referralFee: number
  referralPercentage: number
  // Detailed information for dialog
  residentInfo: {
    facilityName: string
    bookedTime: string
    specialNeeds: string
  }
  bookerInfo: {
    fullName: string
    relationToResident: string
    phoneNumber: string
    emailAddress: string
  }
  bookingDetails: {
    facilityName: string
    roomServiceType: string
    admissionDate: string
    durationOfStay: string
    totalBill: number
  }
}

export async function fetchBookings(
  page = 1,
  limit = 10,
): Promise<{
  data: BookingData[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/bookings?page=${page}&limit=${limit}`)

    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }

    const result = await response.json()

    // Transform API response to match our BookingData interface
    // Adjust this mapping based on your actual API response structure
    return {
      data: result.data || result.bookings || result,
      total: result.total || result.count || 0,
      page: result.page || page,
      totalPages: result.totalPages || Math.ceil((result.total || 0) / limit),
    }
  } catch (error) {
    console.error("Error fetching bookings:", error)
    // Fallback to mock data for development
    const mockData = [
      {
        id: "1",
        invoice: "#3066",
        customer: {
          name: "Olivia Rhye",
          email: "olivia@untitledui.com",
          avatar: "/diverse-woman-avatar.png",
        },
        location: "2715 Ash Dr, San Jo...",
        price: 2000,
        status: "Paid" as const,
        date: "Jan 06, 2025",
        referralFee: 123,
        referralPercentage: 18,
        residentInfo: {
          facilityName: "Sunny Hills Assisted Living",
          bookedTime: "12:00 PM",
          specialNeeds: "Wheelchair accessible room, Vegetarian meals, daily medication assistance.",
        },
        bookerInfo: {
          fullName: "Olivia Rhye",
          relationToResident: "Daughter",
          phoneNumber: "+1 (555) 123-4567",
          emailAddress: "bessiedwards@gmail.com",
        },
        bookingDetails: {
          facilityName: "Hills Assisted Living",
          roomServiceType: "Private Room with Personal Care Support",
          admissionDate: "05 Sept, 2025",
          durationOfStay: "6 Months",
          totalBill: 2000,
        },
      },
      ...Array.from({ length: 20 }, (_, i) => ({
        id: (i + 2).toString(),
        invoice: "#3066",
        customer: {
          name: "Olivia Rhye",
          email: "olivia@untitledui.com",
          avatar: "/diverse-woman-avatar.png",
        },
        location: "2715 Ash Dr, San Jo...",
        price: 2000,
        status: i === 2 || i === 5 ? ("Cancelled" as const) : ("Paid" as const),
        date: "Jan 06, 2025",
        referralFee: i === 2 || i === 5 ? 0 : 123,
        referralPercentage: 18,
        residentInfo: {
          facilityName: "Sunny Hills Assisted Living",
          bookedTime: "12:00 PM",
          specialNeeds: "Wheelchair accessible room, Vegetarian meals, daily medication assistance.",
        },
        bookerInfo: {
          fullName: "Olivia Rhye",
          relationToResident: "Daughter",
          phoneNumber: "+1 (555) 123-4567",
          emailAddress: "bessiedwards@gmail.com",
        },
        bookingDetails: {
          facilityName: "Hills Assisted Living",
          roomServiceType: "Private Room with Personal Care Support",
          admissionDate: "05 Sept, 2025",
          durationOfStay: "6 Months",
          totalBill: 2000,
        },
      })),
    ]

    return {
      data: mockData.slice((page - 1) * limit, page * limit),
      total: mockData.length,
      page,
      totalPages: Math.ceil(mockData.length / limit),
    }
  }
}


// main api


// Get All Blogs with pagination





export async function getBookingdata(page: number, limit: number){
  try {
    const res = await api.get("/bookings", { params: { page, limit } });
    console.log("API response:", res.data);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
  
  }
}

