import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Pencil } from 'lucide-react'
import React from 'react'

interface ProfileData {
  name: string
  email: string
  bio?: string
  phone?: string
  location?: string
  joinDate?: string
  avatar?: string
}

interface DetailsCardProps {
  profileData: ProfileData
}

const DetailsCard: React.FC<DetailsCardProps> = ({ profileData }) => {
  return (
    <div>
      <Card className="overflow-hidden">
        {/* Green header background */}
        <div className="h-24 bg-gradient-to-r from-green-400 to-green-500"></div>

        {/* Profile content */}
        <div className="relative px-6 pb-6">
          {/* Avatar with edit button */}
          <div className="relative -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={profileData.avatar || "/images/profile-pic.jpg"}
                alt={profileData.name}
              />
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
                <span className="text-gray-600">{profileData.bio || "N/A"}</span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Email: </span>
                <span className="text-gray-600">{profileData.email}</span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Phone: </span>
                <span className="text-gray-600">{profileData.phone || "N/A"}</span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Location: </span>
                <span className="text-gray-600">{profileData.location || "N/A"}</span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Since: </span>
                <span className="text-gray-600">{profileData.joinDate || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


export default DetailsCard

