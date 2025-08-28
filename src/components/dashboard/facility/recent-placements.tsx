"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Eye } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

interface ApiPlacement {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: {
      url?: string;
    };
  };
  facility: {
    location: string;
  };
  totalPrice: number;
}

interface Placement {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  location: string;
  amount: number;
}

interface RecentPlacementsProps {
  facilityId: string;
}

// Fetch function
const fetchFacilityPlacements = async (facilityId: string, token: string): Promise<ApiPlacement[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/facility/${facilityId}?page=1&limit=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message || 'Failed to fetch placements');
  }
};

// Transform API response
const transformPlacements = (apiPlacements: ApiPlacement[]): Placement[] => {
  return apiPlacements.map((p) => ({
    id: p._id,
    user: {
      name: `${p.userId.firstName} ${p.userId.lastName}`,
      email: p.userId.email,
      avatar: p.userId.avatar?.url || "/placeholder.svg"
    },
    location: p.facility.location || "Unknown location",
    amount: p.totalPrice || 0
  }));
};

export function RecentPlacements({ facilityId }: RecentPlacementsProps) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const { data: apiPlacements, isLoading } = useQuery({
    queryKey: ['placements', facilityId, token],
    queryFn: () => {
      if (!token) throw new Error('No access token found');
      return fetchFacilityPlacements(facilityId, token);
    },
    enabled: !!token && !!facilityId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const placements = apiPlacements ? transformPlacements(apiPlacements) : [];

  return (
    <div className="bg-white rounded-lg border h-[400px] border-gray-200 p-6  ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Placements</h3>
        <Button variant="link" className="text-green-600 p-0 h-auto">
          See all
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : placements.length > 0 ? (
        <div className="space-y-4">
          {placements.map((placement, index) => (
            <div key={placement.id}>
              <div className="flex items-center justify-between">
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={placement.user.avatar} />
                    <AvatarFallback>
                      {placement.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{placement.user.name}</div>
                    <div className="text-sm text-gray-600">{placement.user.email}</div>
                  </div>
                </div>

                {/* Location */}
                <div className="hidden md:flex items-center text-sm text-gray-600 w-56 truncate">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{placement.location}</span>
                </div>

                {/* Amount */}
                <div className="font-semibold text-gray-900 w-20 text-right">
                  ${placement.amount.toLocaleString()}
                </div>

                {/* Details Button */}
                <Button
                  size="sm"
                  className="bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Details
                </Button>
              </div>
              {index < placements.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No placements found</p>
      )}
    </div>
  );
}
