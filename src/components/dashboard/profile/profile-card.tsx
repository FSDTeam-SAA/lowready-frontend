"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Pencil } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react" // Adjust import based on your auth solution

// API Response Types
interface ApiResponse {
  success: boolean
  message: string
  data: {
    avatar: {
      public_id: string
      url: string
    }
    verificationInfo: {
      token: string
      verified: boolean
    }
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
    avatars: string
    bio: string
    street: string
    postCode: number | null
    phoneNum: string
    createdAt: string
    updatedAt: string
    __v: number
    onboardingStatus: boolean
  }
}

// Fetch user profile function
async function fetchUserProfile(accessToken: string, id: string): Promise<ApiResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }

  return response.json()
}

export function ProfileCard() {
  const { data: session } = useSession()
  
  const { data: userProfile, isLoading, error } = useQuery<ApiResponse, Error>({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(session?.accessToken as string, session?.user.id as string),
    enabled: !!session?.accessToken, // Only run query if access token exists
  })

  // Loading state
  if (isLoading) { // Fixed: Changed !isLoading to isLoading
    return (
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-green-400 to-green-500"></div>
        <div className="relative px-6 pb-6">
          <div className="relative -mt-12 mb-4">
            <div className="h-24 w-24 border-4 border-white shadow-lg rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-red-400 to-red-500"></div>
        <div className="relative px-6 pb-6">
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load profile data</p>
            <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </Card>
    )
  }

  // Extract user data
  const userData = userProfile?.data
  if (!userData) return null

  const fullName = `${userData.firstName} ${userData.lastName}`.trim()
  const avatarUrl = userData.avatar?.url || userData.avatars || ""
  
  // Format join date
  const joinDate = new Date(userData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format location
  const location = userData.street && userData.postCode 
    ? `${userData.street}, ${userData.postCode}`
    : userData.street || "Not specified"

  return (
    <Card className="overflow-hidden h-screen">
      {/* Green header background */}
      <div className="h-24 w-full bg-gradient-to-r from-green-400 to-green-500">

      </div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* Avatar with edit button */}
        <div className="relative -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="text-lg font-semibold">
              {userData.firstName[0]?.toUpperCase() || ''}
              {userData.lastName[0]?.toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 rounded-full bg-green-500 p-2 text-white shadow-lg hover:bg-green-600 transition-colors">
            <Pencil className="h-3 w-3" />
          </button>
        </div>

        {/* User info */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-600">{userData.email}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-900">Name: </span>
              <span className="text-gray-600">{fullName}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Bio: </span>
              <span className="text-gray-600">{userData.bio || "No bio available"}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Email: </span>
              <span className="text-gray-600">{userData.email}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Phone: </span>
              <span className="text-gray-600">{userData.phoneNum || "Not specified"}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Location: </span>
              <span className="text-gray-600">{location}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Role: </span>
              <span className="text-gray-600 capitalize">{userData.role}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Since: </span>
              <span className="text-gray-600">{joinDate}</span>
            </div>

            <div>
              <span className="font-medium text-gray-900">Verified: </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                userData.verificationInfo?.verified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {userData.verificationInfo?.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard