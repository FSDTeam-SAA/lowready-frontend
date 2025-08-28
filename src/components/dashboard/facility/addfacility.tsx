"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/session-context"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { ChevronLeft, Upload, X, Plus, MapPin, Trash2, ImageIcon } from "lucide-react"
import type { Facility } from "@/types/servicefacility"

// Types
type NewAmenityService = { name: string; photo: File | null }
type TimeSlot = { hours: number; minutes: number; period: "AM" | "PM" }
type FacilityFormData = Partial<Omit<Facility, "about">> & {
  about: { description: string; videoTitle: string; videoDescription: string; videoUrl?: string }
  facilityLicenseNumber?: string
}

export default function AddFacilityPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useSession()

  const [formData, setFormData] = useState<FacilityFormData>({
    availability: "Available",
    name: "",
    location: "",
    description: "",
    price: 0,
    priceType: "Monthly",
    amenities: [],
    careServices: [],
    amenityServices: [],
    about: { description: "", videoTitle: "", videoDescription: "" },
    availableTimes: [],
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [facilityLicenseNumber, setFacilityLicenseNumber] = useState("")
  const [medicalDocument, setMedicalDocument] = useState<File | null>(null)
  const [showAmenitiesServicesModal, setShowAmenitiesServicesModal] = useState(false)
  const [newAmenityService, setNewAmenityService] = useState<NewAmenityService>({ name: "", photo: null })
  const [currentTimeSlot, setCurrentTimeSlot] = useState<TimeSlot>({ hours: 12, minutes: 0, period: "AM" })
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [amenityServicesWithPhotos, setAmenityServicesWithPhotos] = useState<{ name: string; photo: File }[]>([])

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
  ]

  const careServiceOptions = [
    "Personal Care",
    "Directed Care",
    "Supervisory Care",
    "Memory Care",
    "Respite and Short Term Care",
    "Behavioural Care",
  ]

  // Redirect unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login")
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-green-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name?.trim()) newErrors.name = "Facility name is required"
    if (!formData.location?.trim()) newErrors.location = "Location is required"
    if (!formData.description?.trim()) newErrors.description = "Description is required"
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required"
    if (!facilityLicenseNumber && !medicalDocument) newErrors.license = "License number or medical document is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) setSelectedImages((prev) => [...prev, ...Array.from(files)])
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedVideo(file)
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setMedicalDocument(file)
  }

  const removeImage = (index: number) => setSelectedImages((prev) => prev.filter((_, i) => i !== index))

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      setFormData((prev) => ({ ...prev, amenities: [...(prev.amenities || []), newAmenity.trim()] }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (amenity: string) =>
    setFormData((prev) => ({ ...prev, amenities: prev.amenities?.filter((a) => a !== amenity) || [] }))

  const addPredefinedAmenity = (amenity: string) => {
    if (!formData.amenities?.includes(amenity))
      setFormData((prev) => ({ ...prev, amenities: [...(prev.amenities || []), amenity] }))
  }

  const handleCareServiceChange = (service: string, checked: boolean) => {
    setFormData((prev) => {
      const current = prev.careServices || []
      return { ...prev, careServices: checked ? [...current, service] : current.filter((s) => s !== service) }
    })
  }

  const handleAmenitiesServicePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setNewAmenityService((prev) => ({ ...prev, photo: file }))
  }

  const addAmenitiesServiceWithPhoto = () => {
    if (newAmenityService.name.trim() && newAmenityService.photo) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAmenityServicesWithPhotos((prev: any) => [
        ...prev,
        { name: newAmenityService.name.trim(), photo: newAmenityService.photo },
      ])
      setNewAmenityService({ name: "", photo: null   })
      setShowAmenitiesServicesModal(false)
    }
  }

  const removeAmenitiesServiceWithPhoto = (index: number) =>
    setAmenityServicesWithPhotos((prev) => prev.filter((_, i) => i !== index))

  const addTimeSlot = () => {
    const formatted = `${String(currentTimeSlot.hours).padStart(2, "0")}:${String(currentTimeSlot.minutes).padStart(2, "0")} ${currentTimeSlot.period}`
    if (!selectedTimes.includes(formatted)) setSelectedTimes((prev) => [...prev, formatted])
  }

  const removeTimeSlot = (time: string) => setSelectedTimes((prev) => prev.filter((t) => t !== time))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name || "")
      formDataToSend.append("location", formData.location || "")
      formDataToSend.append("description", formData.description || "")
      formDataToSend.append("price", (formData.price || 0).toString())
      formDataToSend.append("base", formData.priceType?.toLowerCase() || "monthly")
      formDataToSend.append("availability", formData.availability === "Available" ? "true" : "false")
      formDataToSend.append("about", formData.about?.description || "")
      if (formData.about?.videoTitle) formDataToSend.append("videoTitle", formData.about.videoTitle)
      if (formData.about?.videoDescription) formDataToSend.append("videoDescription", formData.about.videoDescription)
      formData.amenities?.forEach((a) => formDataToSend.append("amenities", a))
      formData.careServices?.forEach((c) => formDataToSend.append("careServices", c))
      amenityServicesWithPhotos.forEach((s) => {
        formDataToSend.append("amenitiesServicesName", s.name)
        formDataToSend.append("amenitiesServices", s.photo)
      })
      selectedTimes.forEach((t) => formDataToSend.append("availableTime", t))
      selectedImages.forEach((img) => formDataToSend.append("image", img))
      if (selectedVideo) formDataToSend.append("video", selectedVideo)
      if (facilityLicenseNumber) formDataToSend.append("facilityLicenseNumber", facilityLicenseNumber)
      if (medicalDocument) formDataToSend.append("medical", medicalDocument)

      const BASE_URL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
      const token = user?.accessToken
      if (!token) throw new Error("Authentication token not found. Please log in again.")

      const response = await fetch(`${BASE_URL_API}/facility/create`, {
        method: "POST",
        body: formDataToSend,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) {
        if (response.status === 401) router.push("/login")
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server responded with ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        alert("Facility created successfully!")
        router.push("/manage-facility")
      } else {
        throw new Error(result.message || "Failed to create facility")
      }
    } catch (error) {
      if (error instanceof Error) alert(`Failed to create facility: ${error.message}`)
      else alert("Failed to create facility. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={() => router.back()} className="mr-4 p-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Add Facility</h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Card: Basic Information */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    {/* Availability */}
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              formData.availability === "Available" ? "bg-green-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="text-sm">
                            {formData.availability === "Available" ? "Available" : "Unavailable"}
                          </span>
                        </div>
                        <Switch
                          checked={formData.availability === "Available"}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              availability: checked ? "Available" : "Unavailable",
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Name here"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <Input
                          id="location"
                          placeholder="Location here"
                          value={formData.location || ""}
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
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Description here"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                  </Card>

                  {/* Card: Pricing */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Pricing</h3>
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
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>
                      <div>
                        <Label htmlFor="priceType">Billed</Label>
                        <Select
                          value={formData.priceType || "Monthly"}
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
                  </Card>

                  {/* Card: Amenities */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Write Here"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                        />
                        <Button type="button" onClick={addAmenity} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Current Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities?.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span>{amenity}</span>
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="ml-1 hover:bg-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      {/* Predefined Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {predefinedAmenities.map((amenity) => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => addPredefinedAmenity(amenity)}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                            disabled={formData.amenities?.includes(amenity)}
                          >
                            {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Card: Care Offering */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Care Offering</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {careServiceOptions.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={formData.careServices?.includes(service)}
                            onCheckedChange={(checked) => handleCareServiceChange(service, !!checked)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <Label htmlFor={service} className="text-sm">
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Card: Amenities Services */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Amenities Services</h3>
                    <Dialog open={showAmenitiesServicesModal} onOpenChange={setShowAmenitiesServicesModal}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="w-full mb-4 bg-transparent">
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
                              <p className="text-sm text-gray-500 mt-2">{newAmenityService.photo.name}</p>
                            )}
                          </div>
                          <Button
                            onClick={addAmenitiesServiceWithPhoto}
                            disabled={!newAmenityService.name || !newAmenityService.photo}
                          >
                            Add
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="space-y-4">
                      {amenityServicesWithPhotos.map((service, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium">{service.name}</Label>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAmenitiesServiceWithPhoto(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Card: Video */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Video</h3>
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
                        <Label htmlFor="videoDescription">Video Description</Label>
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
                        <Label>Upload Video</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Browse and choose the files you want to upload from your computer
                          </p>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                          />
                          <label htmlFor="video-upload">
                            <Button type="button" variant="outline" className="mt-4 bg-transparent cursor-pointer">
                              <Plus className="h-4 w-4 mr-2" /> Upload
                            </Button>
                          </label>
                          {selectedVideo && <p className="text-sm text-green-600 mt-2">{selectedVideo.name}</p>}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Card: License & Medical Documents */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">License & Medical Documents</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facilityLicenseNumber">License Number</Label>
                        <Input
                          id="facilityLicenseNumber"
                          placeholder="Enter license number"
                          value={facilityLicenseNumber}
                          onChange={(e) => setFacilityLicenseNumber(e.target.value)}
                          className={errors.license ? "border-red-500" : ""}
                        />
                      </div>
                      {!facilityLicenseNumber && (
                        <div>
                          <Label>Medical Document</Label>
                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Browse and choose the file you want to upload</p>
                            <input
                              type="file"
                              accept=".pdf, .doc, .docx"
                              onChange={handleDocumentUpload}
                              className="hidden"
                              id="medical-document-upload"
                            />
                            <label htmlFor="medical-document-upload">
                              <Button type="button" variant="outline" className="mt-4 bg-transparent cursor-pointer">
                                <Plus className="h-4 w-4 mr-2" /> Upload
                              </Button>
                            </label>
                            {medicalDocument && <p className="text-sm text-green-600 mt-2">{medicalDocument.name}</p>}
                          </div>
                        </div>
                      )}
                      {errors.license && <p className="text-red-500 text-sm mt-1">{errors.license}</p>}
                    </div>
                  </Card>

                  {/* Card: Available Times */}
                  <Card className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Available Times</h3>
                    <div className="space-y-6">
                      <div className="flex space-x-2 items-center">
                        <div className="flex-1">
                          <Label>Hours</Label>
                          <Select
                            value={String(currentTimeSlot.hours)}
                            onValueChange={(value) =>
                              setCurrentTimeSlot((prev) => ({
                                ...prev,
                                hours: Number(value),
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="HH" />
                            </SelectTrigger>
                            <SelectContent className="h-[200px]">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                <SelectItem key={hour} value={String(hour)}>
                                  {String(hour).padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label>Minutes</Label>
                          <Select
                            value={String(currentTimeSlot.minutes)}
                            onValueChange={(value) =>
                              setCurrentTimeSlot((prev) => ({
                                ...prev,
                                minutes: Number(value),
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="h-[200px]">
                              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                                <SelectItem key={minute} value={String(minute)}>
                                  {String(minute).padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
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
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="button" onClick={addTimeSlot} className="self-end">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {selectedTimes.map((time, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="font-medium">{time}</span>
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(time)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Final Action Buttons */}
                  <div className="flex space-x-4 mt-8">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? "Creating..." : "Add"}
                    </Button>
                  </div>
                </div>

                {/* Right Column - Uploaded Photos Card */}
                <div className="lg:col-span-1">
                  <Card className="bg-white rounded-lg p-6 border border-gray-200 sticky top-8">
                    <h3 className="text-lg font-semibold mb-4">Uploaded Photos</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Browse and choose the files you want to upload from your computer
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="outline" className="cursor-pointer bg-transparent">
                          <Plus className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </label>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg relative group">
                          <Image
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            width={100}
                            height={100}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {Array.from({
                        length: Math.max(0, 3 - selectedImages.length),
                      }).map((_, index) => (
                        <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-lg"></div>
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
  )
}
