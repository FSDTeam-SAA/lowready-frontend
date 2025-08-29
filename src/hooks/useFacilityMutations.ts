// hooks/useFacilityMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface CreateFacilityData {
  name: string
  location: string
  description: string
  price: number
  base: string
  availability: boolean
  about: string
  videoTitle?: string
  videoDescription?: string
  amenities: string[]
  careServices: string[]
  amenitiesServicesName: string[]
  amenitiesServices: File[]
  availableTime: string[]
  images: File[]
  video?: File
  facilityLicenseNumber?: string
  medical?: File
}

interface CreateFacilityResponse {
  success: boolean
  message: string
  data: {
    _id: string
    name: string
    location: string
    description: string
    price: number
    availability: boolean
    images: Array<{
      public_id: string
      url: string
      _id: string
    }>
    base: string
    careServices: string[]
    amenities: string[]
    amenitiesServices: Array<{
      name: string
      image: {
        public_id: string
        url: string
      }
    }>
    about: string
    videoTitle?: string
    videoDescription?: string
    uploadVideo?: string
    availableTime: string[]
    medicaidPrograms?: Array<{
      public_id: string
      url: string
      _id: string
    }>
    createdAt: string
    updatedAt: string
  }
}

const createFacility = async (data: CreateFacilityData, token: string): Promise<CreateFacilityResponse> => {
  const formData = new FormData()
  
  // Append basic fields
  formData.append('name', data.name)
  formData.append('location', data.location)
  formData.append('description', data.description)
  formData.append('price', data.price.toString())
  formData.append('base', data.base.toLowerCase())
  formData.append('availability', data.availability.toString())
  formData.append('about', "about data" )
  
  // Append optional video fields
  if (data.videoTitle) formData.append('videoTitle', data.videoTitle)
  if (data.videoDescription) formData.append('videoDescription', data.videoDescription)
  
  // Append arrays
  data.amenities.forEach(amenity => formData.append('amenities', amenity))
  data.careServices.forEach(service => formData.append('careServices', service))
  data.amenitiesServicesName.forEach(name => formData.append('amenitiesServicesName', name))
  data.availableTime.forEach(time => formData.append('availableTime', time))
  
  // Append files
  data.images.forEach(image => formData.append('image', image))
  data.amenitiesServices.forEach(service => formData.append('amenitiesServices', service))
  if (data.video) formData.append('video', data.video)
  if (data.facilityLicenseNumber) formData.append('facilityLicenseNumber', data.facilityLicenseNumber)
  if (data.medical) formData.append('medical', data.medical)

  const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
  
  const response = await fetch(`${BASE_URL_API}/facility/create`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('UNAUTHORIZED')
    }
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Server responded with ${response.status}`)
  }

  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to create facility')
  }

  return result
}

export const useCreateFacility = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CreateFacilityData) => {
      const token = session?.accessToken
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }
      return createFacility(data, token)
    },
    onSuccess: (data) => {
      // Invalidate and refetch facilities list
      queryClient.invalidateQueries({ queryKey: ['facilities'] })
      
      // Show success message
      console.log('Facility created successfully:', data)
      
      // Navigate to manage facility page
      router.push('/dashboard/facility')
    },
    onError: (error: Error) => {
      if (error.message === 'UNAUTHORIZED') {
        router.push('/login')
      }
      console.error('Failed to create facility:', error.message)
      // You can add toast notification here
    }
  })
}