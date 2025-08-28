import React, { useState, useEffect } from 'react';
import { Star, MapPin, Dot, Wifi, Trees, Plus } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Facility {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price?: number;
  base?: string;
  availability?: boolean | string;
  images?: { url: string }[];
  careServices?: string[];
  amenities?: string[];
  userId?: { firstName: string; lastName: string };
}

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const router = useRouter();
  const firstImage =
    facility.images && facility.images.length > 0
      ? facility.images[0].url
      : '/api/placeholder/400/200';
  const rating = 4.8;
  const reviewCount = 32;

  const isAvailable =
    facility.availability === true || facility.availability === 'true';
  const availabilityText = isAvailable ? 'Available' : 'Unavailable';
  const availabilityColor = isAvailable ? 'text-green-500' : 'text-gray-400';

  const handleDetailsClick = () => {
    router.push(`/dashboard/facility/${facility._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image
          width={400}
          height={200}
          src={firstImage}
          alt={facility.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {facility.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{rating}</span>
            <span className="text-sm text-gray-500">
              ({reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{facility.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Dot className={`w-6 h-6 ${availabilityColor}`} />
          <span className="text-sm text-gray-600">{availabilityText}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            <span>Private</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            <Wifi className="w-3 h-3" />
            <span>Wi-Fi</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            <Trees className="w-3 h-3" />
            <span>Garden</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              $ {facility.price?.toLocaleString() || '2,200'}
            </span>
            <span className="text-gray-500 ml-1">/Month</span>
          </div>
          <Button
            onClick={handleDetailsClick}
            className="bg-green-600 hover:bg-green-800 text-white px-4 py-2"
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

const FacilityListing: React.FC = () => {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('All Facilities');

  const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/facility/all?limit=10`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const facilitiesData: Facility[] = Array.isArray(data)
        ? data
        : data.data || data.facilities || [];

      setFacilities(facilitiesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = () => {
    router.push('/dashboard/facility/add');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Facilities</option>
                <option>Assisted Living</option>
                <option>Memory Care</option>
                <option>Independent Living</option>
              </select>
            </div>

            <Button
              onClick={handleAddFacility}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading facilities...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Facilities
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">Try again later.</p>
            <button
              onClick={fetchFacilities}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h4M9 7h6m-6 4h6m-2 5h.01"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Facilities Found
            </h3>
            <p className="text-gray-600">No facilities are available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <FacilityCard key={facility._id} facility={facility} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityListing;
