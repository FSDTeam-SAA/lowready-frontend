"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ChevronLeft, Upload, X, Plus, MapPin, ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse, AxiosError } from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// TypeScript interfaces
interface Avatar {
  url?: string;
  public_id?: string;
}

interface VerificationInfo {
  token: string;
  verified: boolean;
}

interface TimeSlot {
  hours: number;
  minutes: number;
  period: "AM" | "PM";
}

interface NewAmenityService {
  name: string;
  photo: File | null;
}

interface AmenityServiceWithPhoto {
  name: string;
  photo: File;
}

interface FacilityApiResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  street: string;
  postCode: number | null;
  phoneNum: string;
  avatar?: Avatar;
  verificationInfo?: VerificationInfo;
  role?: string;
  gender?: string;
  dateOfBirth?: string;
  fine?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  onboardingStatus?: boolean;
  availability?: boolean;
  name?: string;
  location?: string;
  description?: string;
  price?: number;
  base?: string;
  amenities?: string[];
  availableTime?: string[];
  about?: string;
  videoTitle?: string;
  videoDescription?: string;
  uploadVideo?: string;
  facilityLicenseNumber?: string;
  medicaidPrograms?: string[];
  images?: string[];
  careServices?: string[];
  amenitiesServices?: string[];
}

interface FormDataState {
  availability: "Available" | "Unavailable";
  name: string;
  location: string;
  address: string;
  description: string;
  price: number;
  priceType: "Monthly" | "Yearly";
  amenities: string[];
  careServices: string[];
  about: {
    description: string;
    videoTitle: string;
    videoDescription: string;
    videoUrl?: string;
  };
  availableTimes: string[];
  firstName: string;
  lastName: string;
  bio: string;
  street: string;
  phoneNum: string;
  postCode: number | null;
  facilityLicenseNumber: string;
  medicaidPrograms: string[];
  amenitiesServices: string[];
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface UpdatePayload {
  _id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  street?: string;
  phoneNum?: string;
  postCode?: number | null;
  availability?: boolean;
  name?: string;
  location?: string;
  description?: string;
  price?: number;
  base?: string;
  amenities?: string[];
  careServices?: string[];
  about?: string;
  videoTitle?: string;
  videoDescription?: string;
  availableTime?: string[];
  facilityLicenseNumber?: string;
  medicaidPrograms?: string[];
  amenitiesServices?: string[];
}

// Custom Components
const FormSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Card className="bg-white rounded-lg p-6 border border-gray-200">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </Card>
);

const FileUploadZone: React.FC<{
  id: string;
  accept: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description: string;
  selectedFile?: string;
  children?: React.ReactNode;
}> = ({
  id,
  accept,
  onFileChange,
  label,
  description,
  selectedFile,
  children,
}) => (
  <div className="space-y-4">
    <Label htmlFor={id}>{label}</Label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={onFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        className="cursor-pointer bg-transparent"
        onClick={() => document.getElementById(id)?.click()}
      >
        <Plus className="h-4 w-4 mr-2" />
        Upload File
      </Button>
      {selectedFile && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">{selectedFile}</p>
            <Button
              type="button"
              onClick={() =>
                onFileChange({
                  target: { files: null },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              className="text-red-500 hover:text-red-700 cursor-pointer p-1"
              title="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
    {children}
  </div>
);

const LoadingSpinner: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
    <p className="text-gray-600 text-lg">{text}</p>
  </div>
);

const ErrorDisplay: React.FC<{
  message: string;
  onRetry: () => void;
}> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <p className="text-red-500 text-lg text-center">{message}</p>
    <div className="flex space-x-4">
      <Button onClick={onRetry} variant="outline">
        Retry
      </Button>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  </div>
);

export default function EditFacilityPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const token = session?.accessToken as string;

  const [formData, setFormData] = useState<FormDataState>({
    availability: "Available",
    name: "",
    location: "",
    address: "",
    description: "",
    price: 0,
    priceType: "Monthly",
    amenities: [],
    careServices: [],
    about: { description: "", videoTitle: "", videoDescription: "" },
    availableTimes: [],
    firstName: "",
    lastName: "",
    bio: "",
    street: "",
    phoneNum: "",
    postCode: null,
    facilityLicenseNumber: "",
    medicaidPrograms: [],
    amenitiesServices: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [medicalDocument, setMedicalDocument] = useState<File | null>(null);
  const [showAmenitiesServicesModal, setShowAmenitiesServicesModal] =
    useState<boolean>(false);
  const [newAmenityService, setNewAmenityService] =
    useState<NewAmenityService>({
      name: "",
      photo: null,
    });
  const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot>({
    hours: 12,
    minutes: 0,
    period: "AM",
  });
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [amenityServicesWithPhotos, setAmenityServicesWithPhotos] = useState<
    AmenityServiceWithPhoto[]
  >([]);

  const predefinedAmenities: string[] = [
    "Room and Board",
    "Private or Shared Rooms",
    "Activities of Daily Living",
    "Medication Management",
    "Meals and Nutrition",
    "Housekeeping and Laundry",
    "Transportation",
    "Social and Recreational Activities",
    "Health Monitoring and Coordination",
  ];

  const careServiceOptions: string[] = [
    "Personal Care",
    "Directed Care",
    "Supervisory Care",
    "Memory Care",
    "Respite and Short Term Care",
    "Behavioural Care",
  ];

  // Utility functions
  const parseAmenities = useCallback((amenities: string[] | undefined): string[] => {
    if (!amenities || amenities.length === 0) return [];

    try {
      return amenities
        .flatMap((amenity) => {
          try {
            return typeof amenity === "string" 
              ? JSON.parse(amenity) 
              : [amenity];
          } catch {
            return [amenity];
          }
        })
        .filter((item): item is string => typeof item === "string" && Boolean(item));
    } catch (error) {
      console.warn("Failed to parse amenities:", error);
      return amenities.filter((a): a is string => typeof a === "string");
    }
  }, []);

  const formatTimeSlots = useCallback((availableTime: string[] | undefined): string[] => {
    if (!availableTime || availableTime.length === 0) return [];

    return availableTime.map((time) => {
      try {
        const date = new Date(time);
        if (isNaN(date.getTime())) return time; // Return original if invalid date
        
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;
        
        return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
      } catch {
        return time; // Return original string if parsing fails
      }
    });
  }, []);

  // Fetch facility details
  const {
    data: facility,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FacilityApiResponse, AxiosError<ApiErrorResponse>>({
    queryKey: ["facility", id],
    queryFn: async (): Promise<FacilityApiResponse> => {
      if (!token || !id) {
        throw new Error("Missing authentication or facility ID");
      }

      const response: AxiosResponse<ApiSuccessResponse<FacilityApiResponse>> = 
        await axios.get(`${API_BASE_URL}/facility/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch facility data");
      }

      return response.data.data;
    },
    enabled: !!token && !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update facility mutation
  const updateFacilityMutation = useMutation<
    ApiSuccessResponse<FacilityApiResponse>,
    AxiosError<ApiErrorResponse>,
    Partial<FormDataState>
  >({
    mutationFn: async (updatedData: Partial<FormDataState>) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      const updatePayload: UpdatePayload = {
        _id: id,
      };

      // Map form data to API expected format
      if (updatedData.firstName !== undefined) updatePayload.firstName = updatedData.firstName;
      if (updatedData.lastName !== undefined) updatePayload.lastName = updatedData.lastName;
      if (updatedData.bio !== undefined) updatePayload.bio = updatedData.bio;
      if (updatedData.street !== undefined) updatePayload.street = updatedData.street;
      if (updatedData.phoneNum !== undefined) updatePayload.phoneNum = updatedData.phoneNum;
      if (updatedData.postCode !== undefined) updatePayload.postCode = updatedData.postCode;
      if (updatedData.availability !== undefined) {
        updatePayload.availability = updatedData.availability === "Available";
      }
      if (updatedData.name !== undefined) updatePayload.name = updatedData.name;
      if (updatedData.location !== undefined) updatePayload.location = updatedData.location;
      if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
      if (updatedData.price !== undefined) updatePayload.price = updatedData.price;
      if (updatedData.priceType !== undefined) {
        updatePayload.base = updatedData.priceType === "Monthly" ? "monthly" : "yearly";
      }
      if (updatedData.amenities !== undefined) updatePayload.amenities = updatedData.amenities;
      if (updatedData.careServices !== undefined) updatePayload.careServices = updatedData.careServices;
      if (updatedData.about?.description !== undefined) updatePayload.about = updatedData.about.description;
      if (updatedData.about?.videoTitle !== undefined) updatePayload.videoTitle = updatedData.about.videoTitle;
      if (updatedData.about?.videoDescription !== undefined) updatePayload.videoDescription = updatedData.about.videoDescription;
      if (updatedData.availableTimes !== undefined) updatePayload.availableTime = updatedData.availableTimes;
      if (updatedData.facilityLicenseNumber !== undefined) updatePayload.facilityLicenseNumber = updatedData.facilityLicenseNumber;
      if (updatedData.medicaidPrograms !== undefined) updatePayload.medicaidPrograms = updatedData.medicaidPrograms;
      if (updatedData.amenitiesServices !== undefined) updatePayload.amenitiesServices = updatedData.amenitiesServices;

      const response: AxiosResponse<ApiSuccessResponse<FacilityApiResponse>> = 
        await axios.put(`${API_BASE_URL}/facility/update/${id}`, updatePayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update facility");
      }

      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["facility", id] });
      toast.success(data.message || "Facility updated successfully");
      router.push("/dashboard/facility");
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      console.error("Update error:", error);
      const errorMessage =
        error.response?.data?.message || 
        error.message || 
        "Failed to update facility";
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    },
  });

  // Prefill form data when facility data is loaded
  useEffect(() => {
    if (facility) {
      const parsedAmenities = parseAmenities(facility.amenities);
      const formattedTimes = formatTimeSlots(facility.availableTime);
      
      setSelectedTimes(formattedTimes);

      setFormData((prev) => ({
        ...prev,
        availability: facility.availability ? "Available" : "Unavailable",
        name: facility.name || `${facility.firstName || ""} ${facility.lastName || ""}`.trim(),
        location: facility.location || facility.street || "",
        address: facility.street || facility.location || "",
        description: facility.description || facility.bio || "",
        price: facility.price || 0,
        priceType: facility.base === "monthly" ? "Monthly" : "Yearly",
        amenities: parsedAmenities,
        careServices: facility.careServices || [],
        about: {
          description: facility.about || facility.description || facility.bio || "",
          videoTitle: facility.videoTitle || "",
          videoDescription: facility.videoDescription || "",
          videoUrl: facility.uploadVideo || "",
        },
        availableTimes: formattedTimes,
        firstName: facility.firstName || facility.name?.split(" ")[0] || "",
        lastName: facility.lastName || facility.name?.split(" ").slice(1).join(" ") || "",
        bio: facility.bio || facility.about || facility.description || "",
        street: facility.street || facility.location || "",
        phoneNum: facility.phoneNum || "",
        postCode: facility.postCode || null,
        facilityLicenseNumber: facility.facilityLicenseNumber || "",
        medicaidPrograms: facility.medicaidPrograms || [],
        amenitiesServices: facility.amenitiesServices || [],
      }));
    }
  }, [facility, parseAmenities, formatTimeSlots]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.phoneNum.trim()) {
      newErrors.phoneNum = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.address, formData.phoneNum]);

  // Handlers
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validImages = Array.from(files).filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
        return isValidType && isValidSize;
      });
      setSelectedImages((prev) => [...prev, ...validImages]);
    }
    e.target.value = "";
  }, []);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = file.type.startsWith("video/");
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      if (isValidType && isValidSize) {
        setSelectedVideo(file);
      } else {
        toast.error("Invalid video file. Please select a video file under 100MB.");
      }
    }
    e.target.value = "";
  }, []);

  const handleDocumentUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg", 
        "image/png"
      ];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (isValidType && isValidSize) {
        setMedicalDocument(file);
      } else {
        toast.error("Invalid document file. Please select a JPG, PNG, or PDF file under 10MB.");
      }
    }
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCareServiceChange = useCallback((service: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.careServices || [];
      return {
        ...prev,
        careServices: checked
          ? [...current, service]
          : current.filter((s) => s !== service),
      };
    });
  }, []);

  const handleAmenitiesServicePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (isValidType && isValidSize) {
        setNewAmenityService((prev) => ({ ...prev, photo: file }));
      } else {
        toast.error("Invalid image file. Please select an image file under 5MB.");
      }
    }
  }, []);

  const addAmenitiesServiceWithPhoto = useCallback(() => {
    if (newAmenityService.name.trim() && newAmenityService.photo) {
      setAmenityServicesWithPhotos((prev) => [
        ...prev,
        {
          name: newAmenityService.name.trim(),
          photo: newAmenityService.photo!,
        },
      ]);
      setNewAmenityService({ name: "", photo: null });
      setShowAmenitiesServicesModal(false);
    }
  }, [newAmenityService]);

  const removeAmenitiesServiceWithPhoto = useCallback((index: number) => {
    setAmenityServicesWithPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addTimeSlot = useCallback(() => {
    const formatted = `${String(currentTimeSlot.hours).padStart(2, "0")}:${String(
      currentTimeSlot.minutes
    ).padStart(2, "0")} ${currentTimeSlot.period}`;
    
    if (!selectedTimes.includes(formatted)) {
      setSelectedTimes((prev) => [...prev, formatted]);
      setFormData((prev) => ({
        ...prev,
        availableTimes: [...prev.availableTimes, formatted],
      }));
    }
  }, [currentTimeSlot, selectedTimes]);

  const removeTimeSlot = useCallback((time: string) => {
    setSelectedTimes((prev) => prev.filter((t) => t !== time));
    setFormData((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes.filter((t) => t !== time),
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    updateFacilityMutation.mutate(formData);
  }, [formData, validateForm, updateFacilityMutation]);

  // Loading states
  if (status === "loading") {
    return <LoadingSpinner text="Initializing..." />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading facility data..." />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={`Failed to load facility data. ${
          error instanceof Error ? error.message : ""
        }`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 p-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Facility
              </h1>
            </div>

            {(errors.general || Object.keys(errors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                {errors.general && (
                  <p className="text-red-800 font-semibold mb-2">{errors.general}</p>
                )}
                {Object.keys(errors).filter(key => key !== 'general').length > 0 && (
                  <div>
                    <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).filter(([key]) => key !== 'general').map(([field, message]) => (
                        <li key={field} className="text-red-700 text-sm">
                          {field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <FormSection title="Basic Information">
                    <div className="space-y-6">
                      {/* Availability */}
                      <div>
                        <Label htmlFor="availability">Availability</Label>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                formData.availability === "Available"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                            <span className="text-sm">
                              {formData.availability === "Available"
                                ? "Available"
                                : "Unavailable"}
                            </span>
                          </div>
                          <Switch
                            checked={formData.availability === "Available"}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                availability: checked
                                  ? "Available"
                                  : "Unavailable",
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* Name */}
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Enter facility name"
                          value={formData.name}
                          onChange={(e) => {
                            const fullName = e.target.value;
                            const nameParts = fullName.split(" ");
                            setFormData((prev) => ({
                              ...prev,
                              name: fullName,
                              firstName: nameParts[0] || "",
                              lastName: nameParts.slice(1).join(" ") || "",
                            }));
                          }}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <Input
                            id="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                          />
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <div className="relative">
                          <Input
                            id="address"
                            placeholder="Enter full address"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: e.target.value,
                                street: e.target.value,
                              }))
                            }
                            className={errors.address ? "border-red-500" : ""}
                          />
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <Label htmlFor="phoneNum">Phone Number *</Label>
                        <Input
                          id="phoneNum"
                          type="tel"
                          placeholder="Enter phone number"
                          value={formData.phoneNum}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phoneNum: e.target.value,
                            }))
                          }
                          className={errors.phoneNum ? "border-red-500" : ""}
                        />
                        {errors.phoneNum && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phoneNum}
                          </p>
                        )}
                      </div>

                      {/* Post Code */}
                      <div>
                        <Label htmlFor="postCode">Post Code</Label>
                        <Input
                          id="postCode"
                          type="number"
                          placeholder="Enter post code"
                          value={formData.postCode || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              postCode: e.target.value
                                ? parseInt(e.target.value)
                                : null,
                            }))
                          }
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter facility description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                              bio: e.target.value,
                              about: {
                                ...prev.about,
                                description: e.target.value,
                              },
                            }))
                          }
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </FormSection>

                  {/* Pricing */}
                  <FormSection title="Pricing">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="$ 0.00"
                          value={formData.price || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: Number.parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="priceType">Billed</Label>
                        <Select
                          value={formData.priceType}
                          onValueChange={(value: "Monthly" | "Yearly") =>
                            setFormData((prev) => ({
                              ...prev,
                              priceType: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </FormSection>

                  {/* Amenities */}
                  <FormSection title="Amenities">
                    <div className="space-y-4">
                      {predefinedAmenities.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={amenity}
                            checked={formData.amenities.includes(amenity)}
                            onCheckedChange={(checked) => {
                              setFormData((prev) => ({
                                ...prev,
                                amenities: checked
                                  ? [...prev.amenities, amenity]
                                  : prev.amenities.filter((a) => a !== amenity),
                              }));
                            }}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Label htmlFor={amenity} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  {/* Care Offering */}
                  <FormSection title="Care Offering">
                    <div className="grid grid-cols-2 gap-4">
                      {careServiceOptions.map((service) => (
                        <div
                          key={service}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={service}
                            checked={formData.careServices.includes(service)}
                            onCheckedChange={(checked) =>
                              handleCareServiceChange(service, !!checked)
                            }
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Label htmlFor={service} className="text-sm">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  {/* Facility License */}
                  <FormSection title="Facility License">
                    <div>
                      <Label htmlFor="facilityLicenseNumber">
                        License Number
                      </Label>
                      <Input
                        id="facilityLicenseNumber"
                        placeholder="Enter license number"
                        value={formData.facilityLicenseNumber}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            facilityLicenseNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </FormSection>

                  {/* Amenities Services */}
                  <FormSection title="Amenities Services">
                    <Dialog
                      open={showAmenitiesServicesModal}
                      onOpenChange={setShowAmenitiesServicesModal}
                    >
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full cursor-pointer mb-4 bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Amenities Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Amenities Service</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amenity-name">Name</Label>
                            <Input
                              id="amenity-name"
                              value={newAmenityService.name}
                              onChange={(e) =>
                                setNewAmenityService((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="amenity-photo">Photo</Label>
                            <Input
                              id="amenity-photo"
                              type="file"
                              accept="image/*"
                              onChange={handleAmenitiesServicePhotoChange}
                            />
                            {newAmenityService.photo && (
                              <p className="text-sm text-gray-500 mt-2">
                                {newAmenityService.photo.name}
                              </p>
                            )}
                          </div>
                          <Button
                            onClick={addAmenitiesServiceWithPhoto}
                            disabled={
                              !newAmenityService.name ||
                              !newAmenityService.photo
                            }
                          >
                            Add
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="space-y-4">
                      {amenityServicesWithPhotos.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 border rounded-lg"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium">
                              {service.name}
                            </Label>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeAmenitiesServiceWithPhoto(index)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  {/* Video */}
                  <FormSection title="Video">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="videoTitle">Video Title</Label>
                        <Input
                          id="videoTitle"
                          placeholder="Enter video title"
                          value={formData.about.videoTitle}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              about: {
                                ...prev.about,
                                videoTitle: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="videoDescription">
                          Video Description
                        </Label>
                        <Textarea
                          id="videoDescription"
                          placeholder="Enter video description"
                          value={formData.about.videoDescription}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              about: {
                                ...prev.about,
                                videoDescription: e.target.value,
                              },
                            }))
                          }
                          className="min-h-[80px]"
                        />
                      </div>
                      <FileUploadZone
                        id="video-upload"
                        accept="video/*"
                        onFileChange={handleVideoUpload}
                        label="Upload Video"
                        description="Browse and choose a video file to upload (max 100MB)"
                        selectedFile={selectedVideo?.name}
                      />
                    </div>
                  </FormSection>

                  {/* Medical Documents */}
                  <FormSection title="Medical Documents">
                    <FileUploadZone
                      id="medical-document-upload"
                      accept=".pdf, .doc, .docx"
                      onFileChange={handleDocumentUpload}
                      label="Medical Document"
                      description="Browse and choose a PDF, DOC, or DOCX file (max 10MB)"
                      selectedFile={medicalDocument?.name}
                    />
                  </FormSection>

                  {/* Available Times */}
                  <FormSection title="Available Times">
                    <div className="space-y-4">
                      <div className="flex items-end gap-2">
                        <div>
                          <Label>Hours</Label>
                          <Select
                            value={currentTimeSlot.hours.toString()}
                            onValueChange={(value) =>
                              setCurrentTimeSlot((prev) => ({
                                ...prev,
                                hours: parseInt(value),
                              }))
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (hour) => (
                                  <SelectItem
                                    key={hour}
                                    value={hour.toString()}
                                  >
                                    {hour}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Minutes</Label>
                          <Select
                            value={currentTimeSlot.minutes.toString()}
                            onValueChange={(value) =>
                              setCurrentTimeSlot((prev) => ({
                                ...prev,
                                minutes: parseInt(value),
                              }))
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 15, 30, 45].map((minute) => (
                                <SelectItem
                                  key={minute}
                                  value={minute.toString()}
                                >
                                  {minute.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Period</Label>
                          <Select
                            value={currentTimeSlot.period}
                            onValueChange={(value: "AM" | "PM") =>
                              setCurrentTimeSlot((prev) => ({
                                ...prev,
                                period: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          className="cursor-pointer"
                          type="button"
                          onClick={addTimeSlot}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTimes.map((time, i) => (
                          <div
                            key={`${facility?._id}-${time}-${i}`}
                            className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{time}</span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(time)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormSection>

                  {/* Final Action Buttons */}
                  {(errors.general || Object.keys(errors).length > 0) && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      {errors.general && (
                        <p className="text-red-800 font-semibold mb-2">{errors.general}</p>
                      )}
                      {Object.keys(errors).filter(key => key !== 'general').length > 0 && (
                        <div>
                          <p className="text-red-800 font-semibold mb-2">Please fix the following errors:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {Object.entries(errors).filter(([key]) => key !== 'general').map(([field, message]) => (
                              <li key={field} className="text-red-700 text-sm">
                                {field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex space-x-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1 cursor-pointer"
                      disabled={updateFacilityMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateFacilityMutation.isPending}
                      className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {updateFacilityMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        "Update Facility"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right Column - Uploaded Photos Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white rounded-lg p-6 border border-gray-200 sticky top-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Uploaded Photos
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Browse and choose the files you want to upload from your
                      computer
                    </p>
                    {selectedImages.length > 0 && (
                      <div className="mb-4 p-2 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          {selectedImages.length} image
                          {selectedImages.length !== 1 ? "s" : ""} selected
                        </p>
                      </div>
                    )}

                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop images here or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Maximum file size: 10MB per image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Images
                      </Button>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.map((image, index) => {
                        const imageUrl = URL.createObjectURL(image);
                        return (
                          <div
                            key={`${image.name}-${index}`}
                            className="aspect-square bg-gray-100 rounded-lg relative group"
                          >
                            <Image
                              src={imageUrl}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                              title="Remove image"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 6 - selectedImages.length),
                      }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center"
                        >
                          <span className="text-gray-400 text-xs">Empty</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}