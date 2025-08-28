import type { Facility } from "@/types/facility"
import { Review } from "@/types/review"

export const facilitiesData: Facility[] = [
  {
    id: "1",
    name: "Sunny Hills Assisted Living",
    rating: 4.8,
    reviewCount: 32,
    description: "Handicapped for comfort, care, and community",
    price: 2200,
    image: "/facilitescard.png",
    categories: [
      { id: "1", name: "Available", type: "available" },
      { id: "2", name: "Private", type: "private" },
      { id: "3", name: "Wi-Fi", type: "wifi" },
      { id: "4", name: "Garden", type: "garden" },
    ],
  },
  {
    id: "2",
    name: "Sunny Hills Assisted Living",
    rating: 4.6,
    reviewCount: 28,
    description: "Handicapped for comfort, care, and community",
    price: 2200,
    image: "/facilitescard.png",
    categories: [
      { id: "5", name: "Available", type: "available" },
      { id: "6", name: "Private", type: "private" },
      { id: "7", name: "Wi-Fi", type: "wifi" },
      { id: "8", name: "Garden", type: "garden" },
    ],
  },
  {
    id: "3",
    name: "Sunny Hills Assisted Living",
    rating: 4.9,
    reviewCount: 45,
    description: "Handicapped for comfort, care, and community",
    price: 2200,
    image: "/facilitescard.png",
    categories: [
      { id: "9", name: "Available", type: "available" },
      { id: "10", name: "Private", type: "private" },
      { id: "11", name: "Wi-Fi", type: "wifi" },
      { id: "12", name: "Garden", type: "garden" },
    ],
  },
  {
    id: "4",
    name: "Sunny Hills Assisted Living",
    rating: 4.7,
    reviewCount: 38,
    description: "Handicapped for comfort, care, and community",
    price: 2200,
    image: "/facilitescard.png",
    categories: [
      { id: "13", name: "Available", type: "available" },
      { id: "14", name: "Private", type: "private" },
      { id: "15", name: "Wi-Fi", type: "wifi" },
      { id: "16", name: "Garden", type: "garden" },
    ],
  },
  {
    id: "5",
    name: "Sunny Hills Assisted Living",
    rating: 4.5,
    reviewCount: 22,
    description: "Handicapped for comfort, care, and community",
    price: 2200,
    image: "/facilitescard.png",
    categories: [
      { id: "17", name: "Available", type: "available" },
      { id: "18", name: "Private", type: "private" },
      { id: "19", name: "Wi-Fi", type: "wifi" },
      { id: "20", name: "Garden", type: "garden" },
    ],
  },
]

export const reveiwsData: Review[] = [
  {
    id:10,
    user:{
      name: "Connect Directly",
      city: "Portland",
      organization: "or",

    },
    imglink:"/facilitescard.png",
    rating: 4,
    comment:"I've been ordering from TABLEFRESH for over year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family."
  },
  {
    id:11,
    user:{
      name: "Connect Directly",
      city: "Portland",
      organization: "or",

    },
    imglink:"/facilitescard.png",
    rating: 4,
    comment:"I've been ordering from TABLEFRESH for over year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family."
  },
  {
    id:12,
    user:{
      name: "Connect Directly",
      city: "Portland",
      organization: "or",

    },
    imglink:"/facilitescard.png",
    rating: 4,
    comment:"I've been ordering from TABLEFRESH for over year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family."
  },
  {
    id:13,
    user:{
      name: "Connect Directly",
      city: "Portland",
      organization: "or",

    },
    imglink:"/facilitescard.png",
    rating: 4,
    comment:"I've been ordering from TABLEFRESH for over year now, and the quality of their organic produce is consistently excellent. The convenience of having fresh, organic food delivered to my door has made healthy eating so much easier for my family."
  }
]
