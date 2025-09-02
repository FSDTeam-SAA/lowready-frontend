"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  AmenityManager,
  FileUploadZone,
  FormSection,
  LoadingSpinner,
  TimeSelector,
} from "@/hooks/FormSection";
import { useCreateFacility } from "@/hooks/useFacilityMutations";
import { toast } from "sonner";
import { PricingModal } from "./pricing-modal";
import { SubscriptionPlan } from "@/types/servicefacility";

// Types
type NewAmenityService = { name: string; photo: File | null };
type TimeSlot = { hours: number; minutes: number; period: "AM" | "PM" };
type FacilityFormData = {
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
};

export default function AddFacilityPage() {

  const [showPricingModal, setShowPricingModal] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const router = useRouter();
  const { status } = useSession();
  const createFacilityMutation = useCreateFacility();

  const isSubscriptionActive = false;
  
    useEffect(()=>{
      setShowPricingModal(!isSubscriptionActive)
    }, [])
  
    const handleSubscribe = (plan: SubscriptionPlan) => {
        setIsSubscribed(true)
        // Simulate subscription process
        setTimeout(() => {
          router.push("/dashboard/facility/add")
        }, 500)
      }
    

  const [formData, setFormData] = useState<FacilityFormData>({
    availability: "Available",
    name: "",
    location: "",
    address: " ",
    description: "",
    price: 0,
    priceType: "Monthly",
    amenities: [],
    careServices: [],
    about: { description: "", videoTitle: "", videoDescription: "" },
    availableTimes: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [facilityLicenseNumber, setFacilityLicenseNumber] = useState("");
  const [medicalDocument, setMedicalDocument] = useState<File | null>(null);
  const [showAmenitiesServicesModal, setShowAmenitiesServicesModal] =
    useState(false);
  const [newAmenityService, setNewAmenityService] = useState<NewAmenityService>(
    { name: "", photo: null }
  );
  const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot>({
    hours: 12,
    minutes: 0,
    period: "AM",
  });
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [amenityServicesWithPhotos, setAmenityServicesWithPhotos] = useState<
    { name: string; photo: File }[]
  >([]);

  const predefinedAmenities = [
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

  const careServiceOptions = [
    "Personal Care",
    "Directed Care",
    "Supervisory Care",
    "Memory Care",
    "Respite and Short Term Care",
    "Behavioural Care",
  ];

  // Show loading spinner while session is loading
  if (status === "loading") {
    return <LoadingSpinner text="Initializing..." />;
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Facility name is required";
    if (!formData.location?.trim()) newErrors.location = "Location is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!facilityLicenseNumber && !medicalDocument)
      newErrors.license = "License number or medical document is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validImages = Array.from(files).filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
        if (!isValidType) {
          alert(`${file.name} is not a valid image file`);
          return false;
        }
        if (!isValidSize) {
          alert(`${file.name} is too large. Maximum size is 10MB`);
          return false;
        }
        return true;
      });
      setSelectedImages((prev) => [...prev, ...validImages]);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const file = e.target.files?.[0];
    if (file) {
      console.log("Video file selected:", file.name, file.type, file.size);
      const isValidType =
        file.type.startsWith("video/") ||
        file.name.toLowerCase().match(/\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i);
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit

      if (!isValidType) {
        alert(
          "Please select a valid video file (MP4, MOV, AVI, MKV, WebM, FLV, WMV)"
        );
        e.target.value = "";
        return;
      }
      if (!isValidSize) {
        alert("Video file is too large. Maximum size is 100MB");
        e.target.value = "";
        return;
      }
      console.log("Video file valid, setting state");
      setSelectedVideo(file);
    } else {
      toast.error('somting error handelvideo upload')
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMedicalDocument(file);
  };

  const removeImage = (index: number) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  const handleCareServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.careServices || [];
      return {
        ...prev,
        careServices: checked
          ? [...current, service]
          : current.filter((s) => s !== service),
      };
    });
  };

  const handleAmenitiesServicePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) setNewAmenityService((prev) => ({ ...prev, photo: file }));
  };

  const addAmenitiesServiceWithPhoto = () => {
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
  };

  const removeAmenitiesServiceWithPhoto = (index: number) =>
    setAmenityServicesWithPhotos((prev) => prev.filter((_, i) => i !== index));

  const addTimeSlot = () => {
    const formatted = `${String(currentTimeSlot.hours).padStart(
      2,
      "0"
    )}:${String(currentTimeSlot.minutes).padStart(2, "0")} ${
      currentTimeSlot.period
    }`;
    if (!selectedTimes.includes(formatted))
      setSelectedTimes((prev) => [...prev, formatted]);
  };

  const removeTimeSlot = (time: string) =>
    setSelectedTimes((prev) => prev.filter((t) => t !== time));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare data for API
    const facilityData = {
      name: formData.name,
      location: formData.location,
      address: formData.address,
      description: formData.description,
      price: formData.price,
      base: formData.priceType.toLowerCase(),
      availability: formData.availability === "Available",
      about: formData.about.description,
      videoTitle: formData.about.videoTitle,
      videoDescription: formData.about.videoDescription,
      amenities: formData.amenities,
      careServices: formData.careServices,
      amenitiesServicesName: amenityServicesWithPhotos.map((s) => s.name),
      amenitiesServices: amenityServicesWithPhotos.map((s) => s.photo),
      availableTime: selectedTimes,
      images: selectedImages,
      video: selectedVideo || undefined, // ✅ Convert null → undefined
      facilityLicenseNumber: facilityLicenseNumber || undefined,
      medical: medicalDocument || undefined,
    };

    createFacilityMutation.mutate(facilityData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>{!isSubscriptionActive ? "Your Subscription has ended, subscribe to add new facility": ""}</div>

            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mr-4 p-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Add Facility
              </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 space-y-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <FormSection title="Basic Information">
                    <div className="space-y-6">
                      {/* Availability */}
                      <div className="">
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
                      <div className="">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Name here"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
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
                            placeholder="Location here"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            className={errors.location ? "border-red-500" : ""}
                          />
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                        {errors.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <Input
                            id="address"
                            placeholder="address here"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                address: e.target.value,
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

                      {/* Description */}
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Description here"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className={`min-h-[100px] ${
                            errors.description ? "border-red-500" : ""
                          }`}
                        />
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.description}
                          </p>
                        )}
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
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.price}
                          </p>
                        )}
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
                    <AmenityManager
                      amenities={formData.amenities}
                      onAmenitiesChange={(amenities) =>
                        setFormData((prev) => ({ ...prev, amenities }))
                      }
                      predefinedAmenities={predefinedAmenities}
                    />
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
                          className="w-full mb-4 bg-transparent"
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
                          placeholder="Title here"
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
                          placeholder="Write here"
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
                      <div>
                        <Label>Upload Video (Alternative Method)</Label>
                        <div className="mt-2 space-y-4">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            id="video-upload-direct"
                          />
                          <p className="text-xs text-gray-500">
                            Supported formats: MP4, MOV, AVI, MKV, WebM, FLV,
                            WMV (Max: 100MB)
                          </p>
                        </div>
                      </div>

                      <FileUploadZone
                        id="video-upload"
                        accept="video/*"
                        onFileChange={handleVideoUpload}
                        label="Upload Video (Drag & Drop)"
                        selectedFile={selectedVideo?.name}
                        description="Browse and choose a video file to upload (max 100MB)"
                      >
                        {selectedVideo && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-900">
                                  {selectedVideo.name}
                                </p>
                                <p className="text-xs text-blue-600">
                                  Size:{" "}
                                  {(selectedVideo.size / (1024 * 1024)).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </p>
                                <p className="text-xs text-blue-600">
                                  Type: {selectedVideo.type || "Unknown"}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  console.log("Removing video file");
                                  setSelectedVideo(null);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove video"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </FileUploadZone>
                    </div>
                  </FormSection>

                  {/* License & Medical Documents */}
                  <FormSection title="License & Medical Documents">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facilityLicenseNumber">
                          License Number
                        </Label>
                        <Input
                          id="facilityLicenseNumber"
                          placeholder="Enter license number"
                          value={facilityLicenseNumber}
                          onChange={(e) =>
                            setFacilityLicenseNumber(e.target.value)
                          }
                          className={errors.license ? "border-red-500" : ""}
                        />
                      </div>
                      {!facilityLicenseNumber && (
                        <>
                          <FileUploadZone
                            id="medical-document-upload"
                            accept=".pdf, .doc, .docx"
                            onFileChange={handleDocumentUpload}
                            label="Medical Document"
                            description="Browse and choose a PDF, DOC, or DOCX file (max 10MB)"
                            selectedFile={medicalDocument?.name}
                          />
                          {medicalDocument && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-green-900">
                                    {medicalDocument.name}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Size:{" "}
                                    {(
                                      medicalDocument.size /
                                      (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setMedicalDocument(null)}
                                  className="text-red-500 hover:text-red-700 p-1"
                                  title="Remove document"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {errors.license && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.license}
                        </p>
                      )}
                    </div>
                  </FormSection>

                  {/* Available Times */}
                  <FormSection title="Available Times">
                    <TimeSelector
                      hours={currentTimeSlot.hours}
                      minutes={currentTimeSlot.minutes}
                      period={currentTimeSlot.period}
                      onTimeChange={setCurrentTimeSlot}
                      onAddTime={addTimeSlot}
                      selectedTimes={selectedTimes}
                      onRemoveTime={removeTimeSlot}
                    />
                  </FormSection>

                  {/* Final Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createFacilityMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {createFacilityMutation.isPending ? "Creating..." : "Add"}
                    </Button>
                  </div>

                  {/* Error Message */}
                  {createFacilityMutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 text-sm">
                        {createFacilityMutation.error?.message ||
                          "Failed to create facility. Please try again."}
                      </p>
                    </div>
                  )}
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
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const files = e.dataTransfer.files;
                        if (files) {
                          const syntheticEvent = {
                            target: { files },
                            currentTarget: { files },
                          } as React.ChangeEvent<HTMLInputElement>;
                          handleImageUpload(syntheticEvent);
                        }
                      }}
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
                              onLoad={() => {
                                // Clean up the object URL after the image loads to free memory
                                // Don't revoke immediately as Image component might need it
                                setTimeout(
                                  () => URL.revokeObjectURL(imageUrl),
                                  1000
                                );
                              }}
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
              <PricingModal open={showPricingModal} onOpenChange={setShowPricingModal} onSubscribe={handleSubscribe} />
        
      </div>

      
    </div>


  );
}
