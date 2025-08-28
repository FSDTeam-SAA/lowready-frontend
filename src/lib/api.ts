import {
  ApiResponse,
  Booking,
  ChangePasswordResponse,
  PaginatedResponse,
  RebookData,
  RebookResponse,
  ReviewData,
  User,
  VisitBooking,
} from "@/types/account";
import axios from "axios";

import { getSession } from "next-auth/react";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to attach token from next-auth session
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    } else {
      console.warn("No token in session");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------
// Blog API
// -------------------------------
export async function getAllBlogs() {
  const res = await api.get(`/blog/all`);
  return res.data;
}

export async function getAllBlogsPagination(page: number, limit: number) {
  const res = await api.get(`/blog/all?page=${page}&limit=${limit}`);
  return res.data;
}

export async function getSingleBlog(id: string) {
  const res = await api.get(`/blog/${id}`);
  return res.data;
}

// -------------------------------
/// Booking Types
// -------------------------------
export interface BookingData {
  id: string;
  invoice: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  location: string;
  price: number;
  status: "Paid" | "Cancelled";
  date: string;
  referralFee: number;
  referralPercentage: number;
  residentInfo: {
    facilityName: string;
    bookedTime: string;
    specialNeeds: string;
  };
  bookerInfo: {
    fullName: string;
    relationToResident: string;
    phoneNumber: string;
    emailAddress: string;
  };
  bookingDetails: {
    facilityName: string;
    roomServiceType: string;
    admissionDate: string;
    durationOfStay: string;
    totalBill: number;
  };
}

export interface Facility {
  name: string;
  location: string;
  price: number;
  images: string[];
}

export interface Avatar {
  public_id: string;
  url: string;
}

export interface VerificationInfo {
  token: string;
  verified: boolean;
}

// export interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role?: string;

//   // optional fields
//   avatar?: Avatar;
//   avatars?: string;
//   bio?: string;
//   street?: string;
//   postCode?: string | null;
//   phoneNum?: string;
//   verificationInfo?: VerificationInfo;

//   // timestamps
//   createdAt?: string;
//   updatedAt?: string;

//   onboardingStatus?: boolean;
// }

export interface ApiBooking {
  _id: string;
  facility: Facility | null;
  userId: User;
  startingDate: string;
  duration: string;
  paymentStatus: "paid" | "cancelled";
  totalPrice: number;
  specialNeeds?: string;
  relationToResident?: string;
  phoneNumber?: string;
}

// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     totalPages: number;
//     totalItems: number;
//     currentPage: number;
//     itemsPerPage: number;
//   };
// }

// -------------------------------
// Mapper: ApiBooking → BookingData
// -------------------------------
export function mapApiBookingToBookingData(
  apiBooking: ApiBooking,
  index: number
): BookingData {
  const facility = apiBooking.facility; // can be null
  return {
    id: apiBooking._id,
    invoice: `INV-${index + 1}`,
    customer: {
      name: `${apiBooking.userId.firstName} ${apiBooking.userId.lastName}`,
      email: apiBooking.userId.email,
      avatar: apiBooking.userId.avatar?.url || "/placeholder.svg",
    },
    location: facility?.location || "N/A",
    price: apiBooking.totalPrice,
    status: apiBooking.paymentStatus === "paid" ? "Paid" : "Cancelled",
    date: new Date(apiBooking.startingDate).toLocaleDateString(),
    referralFee: parseFloat((apiBooking.totalPrice * 0.18).toFixed(2)),
    referralPercentage: 18,
    residentInfo: {
      facilityName: facility?.name || "N/A",
      bookedTime: new Date(apiBooking.startingDate).toLocaleTimeString(),
      specialNeeds: apiBooking.specialNeeds || "N/A",
    },
    bookerInfo: {
      fullName: `${apiBooking.userId.firstName} ${apiBooking.userId.lastName}`,
      relationToResident: apiBooking.relationToResident || "N/A",
      phoneNumber: apiBooking.phoneNumber || "N/A",
      emailAddress: apiBooking.userId.email,
    },
    bookingDetails: {
      facilityName: facility?.name || "N/A",
      roomServiceType: "Standard",
      admissionDate: new Date(apiBooking.startingDate).toLocaleDateString(),
      durationOfStay: apiBooking.duration,
      totalBill: apiBooking.totalPrice,
    },
  };
}

// -------------------------------
// Booking API
// -------------------------------
export async function getFacilities() {
  try {
    const res = await api.get("/facility/my-facilities");
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching facilities: ${error.message}`);
    }
    throw error;
  }
}

// ✅ unified customer/bookings API
export async function getCustomers(
  facilityId: string,
  page: number,
  limit: number
): Promise<PaginatedResponse<ApiBooking>> {
  try {
    const res = await api.get(
      `/bookings/facility/${facilityId}?page=${page}&limit=${limit}`
    );
    return res.data as PaginatedResponse<ApiBooking>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
    throw error;
  }
}

// -------------------------------
// Notifications API
// -------------------------------
export async function getNotifications(userId: string) {
  try {
    const res = await api.get(`/notifications/${userId}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching notifications: ${error.message}`);
    }
    throw error;
  }
}

// -------------------------------
// Tour Requests
// -------------------------------
export interface FacilityImage {
  public_id: string;
  url: string;
  _id: string;
}

export interface TourRequest {
  _id: string;
  userId: User;
  name: string;
  email: string;
  phoneNumber: string;
  relationWith: string;
  message: string;
  facility: Facility;
  visitDate: string;
  visitTime: string;
  rating: number;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  images: FacilityImage[];
}

export interface TourRequestResponse {
  success: boolean;
  message: string;
  data: {
    bookings: TourRequest[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function getTourRequest(): Promise<TourRequestResponse> {
  try {
    const res = await api.get("/visit-booking/facility-bookings");
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching tour requests: ${error.message}`);
    }
    throw error;
  }
}

// tour reschedule 
export async function rescheduleTour(bookingId: string, ) {
  try {
    const res = await api.put(`/visit-booking/status/${bookingId}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error rescheduling tour: ${error.message}`);
    }
    throw error;
  }
}

//? accouunt related api

// Update user profile
export async function updateUserProfile(
  formData: FormData
): Promise<ApiResponse<User>> {
  const res = await api.patch("/user/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

// Change password
export async function changePassword(data: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<ChangePasswordResponse>> {
  const res = await api.post("/user/change-password", data);
  return res.data;
}

// Get user booking history
export async function getUserBookings(
  userId: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Booking>> {
  console.log("userId in API call:", userId);
  const res = await api.get(
    `/bookings/user/${userId}?page=${page}&limit=${limit}`
  );
  return res.data;
}

// Get single booking details
export async function getBookingDetails(
  bookingId: string
): Promise<ApiResponse<Booking>> {
  const res = await api.get(`/bookings/${bookingId}`);
  return res.data;
}

// Get user tour history
export async function getUserTourHistory(): Promise<
  ApiResponse<VisitBooking[]>
> {
  const res = await api.get("/visit-booking/my-bookings");
  return res.data;
}

// Submit review/feedback
export async function submitReview(
  data: ReviewData
): Promise<ApiResponse<ReviewResponse>> {
  const res = await api.post("/review-rating", data);
  return res.data;
}

// Rebook facility
export async function rebookFacility(
  facilityId: string,
  bookingData: RebookData
): Promise<ApiResponse<RebookResponse>> {
  const res = await api.post(`/bookings/rebook/${facilityId}`, bookingData);
  return res.data;
}

// review Ratings
export interface Review {
  _id: string;
  comment: string;
  star: number;
  createdAt: string;
  updatedAt: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  facility: {
    _id: string;
    name: string;
  };
}

export interface ReviewResponse {
  success: boolean;
  total: number;
  data: Review[];
}

export async function getReviewRating(id: string) {
  try {
    const res = await api.get(`/review-rating/facility/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching review and ratings: ${error.message}`);
    }
  }
}

// Review Delete

export async function DeleteReview(id: string) {
  try {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted you Review: ${error.message}`);
    }
  }
}

export const getBookingHistory = getUserBookings;
export const getTourHistory = getUserTourHistory;
export const rebookTour = rebookFacility;
