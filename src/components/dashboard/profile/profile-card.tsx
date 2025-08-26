"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Pencil } from "lucide-react"

// Dummy data - will be replaced with TanStack Query API call
const profileData = {
  name: "Olivia Rhye",
  email: "bessieedwards@gmail.com",
  bio: "Fashion designer passionate about creating styles that celebrate individuality and comfort.",
  phone: "+1 (555) 123-4567",
  location: "1234 Oak Avenue, San Francisco, CA 94102A",
  joinDate: "14 August, 2025",
  avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile-pic.jpg-19DPq6d0yjCH87F1Gapu3bisKDkZT6.jpeg",
}

export function ProfileCard() {
  return (
    <Card className="overflow-hidden">
      {/* Green header background */}
      <div className="h-24 bg-gradient-to-r from-green-400 to-green-500"></div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* Avatar with edit button */}
        <div className="relative -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.name} />
            <AvatarFallback className="text-lg font-semibold">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 rounded-full bg-green-500 p-2 text-white shadow-lg hover:bg-green-600 transition-colors">
            <Pencil className="h-3 w-3" />
          </button>
        </div>

        {/* User info */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
            <p className="text-sm text-gray-600">{profileData.email}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-900">Name: </span>
              <span className="text-gray-600">{profileData.name}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Bio: </span>
              <span className="text-gray-600">{profileData.bio}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Email: </span>
              <span className="text-gray-600">{profileData.email}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Phone: </span>
              <span className="text-gray-600">{profileData.phone}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Location: </span>
              <span className="text-gray-600">{profileData.location}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Since: </span>
              <span className="text-gray-600">{profileData.joinDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}


export default ProfileCard;