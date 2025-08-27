export interface Facility {
  id: string
  name: string
  rating: number
  reviewCount: number
  description: string
  price: number
  image: string
  categories: Category[]
}

export interface Category {
  id: string
  name: string
  type: "available" | "private" | "wifi" | "garden" | "other"
}

export const CATEGORY_TYPES = {
  available: "Available",
  private: "Private",
  wifi: "Wi-Fi",
  garden: "Garden",
  other: "Other",
} as const


