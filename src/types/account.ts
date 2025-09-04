/* eslint-disable @typescript-eslint/no-explicit-any */
// TypeScript interfaces for API responses
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  gender: string;
  bio: string;
  street: string;
  postCode: number;
  phoneNum: string;
  dateOfBirth: string;
  avatar: {
    url: string;
    public_id: string;
  };
  fine: number;
  refresh_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  rating: string;
  reviews: string;
  _id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  availability: boolean;
  images: Array<{
    public_id: string;
    url: string;
    _id: string;
  }>;
  base: string;
  amenities: string[];
  offers: string[];
  services: Array<{
    label: string;
    title: string;
    _id: string;
  }>;
  about: string;
  videoTitle: string;
  videoDescription: string;
  uploadVideo: string;
  availableTime: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  facility: Facility;
  userId: User;
  startingDate: string;
  duration: string;
  paymentStatus: string;
  residentialInfo: Array<{
    name: string;
    dateOfBirth: string;
    gender: string;
    requirements: string;
  }>;
  totalPrice: number;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VisitBooking {
  // booking: BookingData;
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  relationWith: string;
  message: string;
  facility: {
    _id: string;
    name: string;
    location: string;
    price: number;
    images: Array<{
      public_id: string;
      url: string;
      _id: string;
    }>;
  };
  visitDate: string;
  visitTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  facility: any;
  startingDate: string | number | Date;
  duration: any;
  totalPrice: any;
  paymentStatus: string;
  residentialInfo: any;
  success: boolean;
  message: string;
  data: T;
  total?: number | string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    total?: number | string;
  };
}

// Additional interfaces for better type safety
export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface ReviewData {
  star: number;
  comment: string;
  userId?: string;
  facility: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    rating: number;
    description: string;
    userId: string;
    bookingId?: string;
    createdAt: string;
  };
}

export interface RebookData {
  startingDate: string;
  duration: string;
  residentialInfo: Array<{
    name: string;
    dateOfBirth: string;
    gender: string;
    requirements: string;
  }>;
}

export interface RebookResponse {
  success: boolean;
  message: string;
  data: Booking;
}
