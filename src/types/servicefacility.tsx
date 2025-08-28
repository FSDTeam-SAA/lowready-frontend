export interface Facility {
  id: string
  name: string
  location: string
  description: string
  price: number
  priceType: "Monthly" | "Yearly"
  availability: "Available" | "Unavailable"
  image?: string
  amenities: string[]
  careServices: string[]
  amenityServices: string[]
  about: {
    description: string
    videoTitle?: string
    videoDescription?: string
    videoUrl?: string
  }
  availableTimes: {
    day: string
    times: string[]
  }[]
  facilityLicenseNumber?: string
  medicaidPrograms?: {
    public_id: string
    url: string
    _id: string
  }[]
}

export interface User {
  name: string
  email: string
  avatar?: string
}

export interface Placement {
  id: string
  user: User
  location: string
  amount: number
}

export interface Review {
  id: string
  user: User
  rating: number
  comment: string
  location: string
}

export type SubscriptionPlan = "monthly" | "yearly"