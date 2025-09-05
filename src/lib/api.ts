import {
  ApiResponse,
  Booking,
  ChangePasswordResponse,
  
  RebookData,
  RebookResponse,
  ReviewData,
  VisitBooking,
} from "@/types/account";
import axios from "axios";

import { getSession } from "next-auth/react";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://lowready-backend.onrender.com/api/v1";

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
  images: Avatar[];
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
  images: ImageType[];
}

export interface Avatar {
  public_id: string;
  url: string;
  _id?: string;
}

export interface VerificationInfo {
  token: string;
  verified: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;

  // optional fields
  avatar?: Avatar;
  avatars?: string;
  bio?: string;
  street?: string;
  postCode?: string | null;
  phoneNum?: string;
  verificationInfo?: VerificationInfo;

  // timestamps
  createdAt?: string;
  updatedAt?: string;

  onboardingStatus?: boolean;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

// -------------------------------
// Mapper: ApiBooking → BookingData
// -------------------------------
export function mapApiBookingToBookingData(
  apiBooking: ApiBooking
): BookingData {
  const facility = apiBooking.facility; // can be null
  return {
    id: apiBooking._id,
    invoice: `${apiBooking._id.slice(0, 4)}`,
    customer: {
      name: `${apiBooking.userId.firstName} ${apiBooking.userId.lastName}`,
      email: apiBooking.userId.email,
      avatar: apiBooking.userId.avatar?.url || "/placeholder.svg",
    },
    images: facility?.images || [], // ✅ Added
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

// get all facilites data
export async function getallFacilitiesdata(
  facilityId: string,
  page?: number,
  limit?: number
) {
  try {
    const res = await api.get(
      `/bookings/organization/${facilityId}?page=${page}&limit=${limit}`
    );
    return res.data as PaginatedResponse<ApiBooking>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }
    throw error;
  }
}

// customer/bookings API
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

// recent placement
export async function getrecentPlacement(
  facilityId: string
): Promise<PaginatedResponse<ApiBooking>> {
  try {
    const res = await api.get(`/bookings/facility/${facilityId}`);
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

export async function clearAllNotifications(userId: string): Promise<void> {
  try {
    const res = await api.delete(`/notifications/${userId}/clear`);
    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to clear notifications");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error clearing notifications: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
  }
}
export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  try {
    const res = await api.patch(`/notifications/${notificationId}/read`);
    if (!res.data.success) {
      throw new Error(
        res.data.message || "Failed to mark notification as read"
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
    throw new Error("Unknown error occurred");
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

// tour status update
export async function statusTourRequest(bookingId: string) {
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
export async function statusCancelTourRequest(bookingId: string) {
  try {
    const res = await api.put(`/visit-booking/status-cancel/${bookingId}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error rescheduling tour: ${error.message}`);
    }
    throw error;
  }
}

interface CreateBookingData {
  name: string;
  email: string;
  phoneNumber: string;
  relationWith: string;
  message: string;
  facility: string;
  visitDate: string; // Date formatted as "YYYY-MM-DD"
  visitTime: string;
}
export async function CreateBookingTour(data: CreateBookingData) {
  try {
    const response = await api.post("/visit-booking/create", data, {
      headers: {
        "Content-Type": "application/json", // Ensure the correct content type
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating booking: ${error.message}`);
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

export async function getReviewRating() {
  try {
    const res = await api.get(`/review-rating/facility/all`);
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
    const res = await api.delete(`/review-rating/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted you Review: ${error.message}`);
    }
  }
}

// create review
interface CreateReviewRequest {
  userId: string;
  facility: string;
  star: number;
  comment: string;
}
export const createReview = async (
  reviewData: CreateReviewRequest
): Promise<Review> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/review-rating`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create review");
  }

  return response.json();
};

//fetch review data

export async function fetchReviews(facilityId: string) {
  try {
    const response = await api.get(`/review-rating/facility/${facilityId}`);
    const data = response.data;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted you Review: ${error.message}`);
    }
  }
}

//get facilities review by facilites

export async function getbySigleFacilities(id: string) {
  try {
    console.log("ides", id);

    const res = await api.get(`/facility/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted you Review: ${error.message}`);
    }
  }
}

export interface FacilityFilters {
  location?: string;
  careServices?: string[];
  amenities?: string[];
  page?: number;
  limit?: number;
  rating?: number;
  minPrice?: number | string;
  maxPrice?: number | string;
  availability?: boolean;
}

// ---------- Sub-types ----------
export interface ImageType {
  public_id: string;
  url: string;
  _id?: string;
}

export interface AmenityService {
  name: string;
  image: ImageType;
}

export interface MedicaidProgram {
  public_id: string;
  url: string;
  _id?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// ---------- Facility ----------
export interface Facility {
  _id: string;
  name: string;
  location: string;
  description?: string;
  about?: string;
  images: ImageType[];
  amenities: string[];
  amenitiesServices?: AmenityService[];
  careServices?: string[];
  medicaidPrograms?: MedicaidProgram[];
  rating?: number;
  price: number;
  base?: string; // e.g. "monthly"
  availability?: boolean;
  availableTime?: string[];
  uploadVideo?: string;
  videoTitle?: string;
  videoDescription?: string;
  userId?: User;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface FacilityCards {
  _id: string;
  name: string;
  location: string;
  description?: string;
  about?: string;
  images: ImageType[];
  amenities: string[];
  amenitiesServices?: AmenityService[];
  careServices?: string[];
  medicaidPrograms?: MedicaidProgram[];
  rating?: number;
  ratingCount?: number;
  price: number;
  base?: string; // e.g. "monthly"
  availability?: boolean;
  availableTime?: string[];
  uploadVideo?: string;
  videoTitle?: string;
  videoDescription?: string;
  userId?: User;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  reviewCount?: number;
}

// ---------- API Response ----------
export interface FacilitySearchResponse {
  data: Facility[];
  totalPages?: number;
}

// ---------- API Function ----------
export async function FacilitySearchData(
  filters: FacilityFilters
): Promise<FacilitySearchResponse> {
  try {
    const res = await api.get(`/facility/all`, { params: filters });
    return res.data as FacilitySearchResponse;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return { data: [], totalPages: 1 };
  }
}
export async function getallFacilities(): Promise<FacilitySearchResponse> {
  try {
    const res = await api.get(`/facility/all`);
    return res.data as FacilitySearchResponse;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return { data: [], totalPages: 1 };
  }
}

// Locations API
export interface Location {
  _id: string;
  location: string;
}

export async function facilitiesLocation(): Promise<{ data: Location[] }> {
  try {
    const res = await api.get(`/facility/locations`);
    return res.data as { data: Location[] };
  } catch (error) {
    console.error("Error fetching locations:", error);
    return { data: [] };
  }
}

//f Booking// api/booking.ts
export interface BookingType {
  _id?: string; // Add optional ID for updates
  facility: string;
  userId: string;
  startingDate: string;
  duration: string;
  paymentStatus: "paid" | "unpaid" | "pending";
  residentialInfo: {
    name: string;
    dateOfBirth: string;
    gender: "male" | "female" | "other";
    requirements?: string;
  }[];
  totalPrice: number;
}

// Create booking
export async function createBooking(userData: BookingType) {
  try {
    const res = await api.post(`/bookings`, userData);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Booking Error ${error.message}`);
    }
  }
}

// Update booking
export async function updateBooking(
  bookingId: string,
  userData: Partial<BookingType>
) {
  try {
    const res = await api.patch(`/bookings/${bookingId}`, userData);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Update Booking Error ${error.message}`);
    }
  }
}

// Get booking by ID
export async function getBookingById(bookingId: string) {
  try {
    const res = await api.get(`/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Booking Error ${error.message}`);
    }
  }
}

export const getBookingHistory = getUserBookings;
export const getTourHistory = getUserTourHistory;
export const rebookTour = rebookFacility;

//Subscription

// ✅ Fetch subscriptions

export async function fetchSubscription() {
  const res = await api.get(`/payment/user/all?type=subscription`);
  // if (!res.ok) throw new Error("Failed to fetch subscription");
  const json = await res.data;
  return json.data[0]; // Take the first subscription only
}

export async function reviewratinSummery(id: string) {
  try {
    const res = await api.get(`review-rating/summary/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Get Booking Error ${error.message}`);
    }
  }
}

// create contact us data
export async function createContactUs(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}) {
  try {
    const res = await api.post(`/contactUs/send-message`, userData);
    return res.data;
  } catch {
    throw new Error("Contact Us Error");
  }
}
export async function reviewRatingsummery() {
  try {
    const res = await api.get(`/review-rating/summary/all-reviews`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return { data: [], totalPages: 1 };
  }
}

export async function DeleteRatingReview(id: string) {
  try {
    const res = await api.delete(`/review-rating/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted you Review: ${error.message}`);
    }
  }
}
// Delete Placement history
export async function deletePlacement(id: string) {
  try {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error Deleted plecement data: ${error.message}`);
    }
  }
}

//dashboard summery

// --- Types ---

interface dashboardsummer{
  totalBookings?: number;
  totalEarnings?: number;
  referralFee?: number;
  residentsServed?:number;
}
export interface DashboardSummary {
  data:dashboardsummer;
}

// --- API Call ---
export async function getDashboardSummery(): Promise<DashboardSummary> {
  try {
    const res = await api.get(`/dashboard/org-dashboard`);
    return res.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching dashboard summary: ${error.message}`);
    }
    throw error;
  }
}