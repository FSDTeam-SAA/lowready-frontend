"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Upload,
  X,
  Plus,
  Home,
  MapPin,
  Users,
  Car,
  Utensils,
  Activity,
  Shield,
  Trash2,
} from "lucide-react";
import type { Facility } from "@/types/servicefacility";
import { Card } from "@/components/ui/card";

export default function AddFacilityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Facility>>({
    availability: "Available",
    name: "",
    location: "",
    description: "",
    price: 0,
    priceType: "Monthly",
    amenities: [],
    careServices: [],
    amenityServices: [],
    about: {
      description: "",
      videoTitle: "",
      videoDescription: "",
    },
    availableTimes: [
      { day: "Monday", times: [] },
      { day: "Tuesday", times: [] },
      { day: "Wednesday", times: [] },
    ],
  });

  const [newAmenity, setNewAmenity] = useState("");
  const [newCareService, setNewCareService] = useState("");
  const [newAmenityService, setNewAmenityService] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const predefinedAmenities = [
    "Assisted Living",
    "Memory Care",
    "Medication Management",
    "24/7 Nursing Support",
    "Nutritious Meals",
    "Housekeeping & Laundry",
    "Transportation Services",
    "Social & Recreational Activities",
    "Outdoor Gardens",
  ];

  const careServiceOptions = [
    { id: "personal-care", label: "Personal Care", checked: false },
    { id: "directed-care", label: "Directed Care", checked: false },
    { id: "supervisory-care", label: "Supervisory Care", checked: false },
    { id: "memory-care", label: "Memory Care", checked: false },
    {
      id: "respite-care",
      label: "Respite and Short Term Care",
      checked: false,
    },
    { id: "behavioral-care", label: "Behavioural Care", checked: false },
  ];

  const amenityServiceOptions = [
    { id: "room-board", label: "Room and Board", icon: Home, checked: false },
    {
      id: "private-shared",
      label: "Private or shared rooms",
      icon: Home,
      checked: false,
    },
    {
      id: "daily-living",
      label: "Activities of Daily Living",
      icon: Users,
      checked: false,
    },
    {
      id: "medication-mgmt",
      label: "Medication Management",
      icon: Shield,
      checked: false,
    },
    {
      id: "meals-nutrition",
      label: "Meals and Nutrition",
      icon: Utensils,
      checked: false,
    },
    {
      id: "housekeeping",
      label: "Housekeeping and Laundry",
      icon: Home,
      checked: false,
    },
    {
      id: "transportation",
      label: "Transportation",
      icon: Car,
      checked: false,
    },
    {
      id: "social-activities",
      label: "Social and Recreational Activities",
      icon: Users,
      checked: false,
    },
    {
      id: "health-monitoring",
      label: "Health Monitoring and Coordination",
      icon: Activity,
      checked: false,
    },
    {
      id: "medicaid-licenses",
      label: "Filed special Medicaid program licenses",
      icon: Shield,
      checked: false,
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Facility name is required";
    }
    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Creating facility:", formData);
      router.push("/manage-facility?demo=true");
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.filter((a) => a !== amenity) || [],
    }));
  };

  const addPredefinedAmenity = (amenity: string) => {
    if (!formData.amenities?.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenity],
      }));
    }
  };

  const addTime = (day: string, time: string) => {
    if (!time) return;

    setFormData((prev) => ({
      ...prev,
      availableTimes:
        prev.availableTimes?.map((dayTime) =>
          dayTime.day === day
            ? { ...dayTime, times: [...dayTime.times, time] }
            : dayTime
        ) || [],
    }));
  };

  const removeTime = (day: string, timeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      availableTimes:
        prev.availableTimes?.map((dayTime) =>
          dayTime.day === day
            ? {
                ...dayTime,
                times: dayTime.times.filter((t) => t !== timeToRemove),
              }
            : dayTime
        ) || [],
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
                Add Facility
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Form Fields */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Basic Information */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="space-y-6">
                      {/* Availability */}
                      <Card className="p-8">
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
                      </Card>

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
                        {errors.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location}
                          </p>
                        )}
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
                  </div>

                  {/* Pricing */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
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
                  </div>

                  {/* Amenities */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <Label>Amenities</Label>
                    <div className="mt-4 space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Write Here"
                          value={newAmenity}
                          onChange={(e) => setNewAmenity(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addAmenity())
                          }
                        />
                        <Button type="button" onClick={addAmenity} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Current Amenities */}
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities?.map((amenity, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{amenity}</span>
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
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
                  </div>

                  {/* Care Offering */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      Care Offering
                    </h3>

                    {/* Care Services */}
                    <div className="mb-6">
                      <Label>Care Services</Label>
                      <div className="mt-4 space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Write Here"
                            value={newCareService}
                            onChange={(e) => setNewCareService(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), setNewCareService(""))
                            }
                          />
                          <Button type="button" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {careServiceOptions.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={service.id}
                                checked={service.checked}
                                className="data-[state=checked]:bg-green-600"
                              />
                              <Label htmlFor={service.id} className="text-sm">
                                {service.label}
                              </Label>
                              <button
                                type="button"
                                className="ml-auto text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Amenities Services */}
                    <div>
                      <Label>Amenities Services</Label>
                      <div className="mt-4 space-y-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add New Amenities"
                            value={newAmenityService}
                            onChange={(e) =>
                              setNewAmenityService(e.target.value)
                            }
                          />
                          <Button type="button" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {amenityServiceOptions.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center space-x-3 p-2 border rounded-lg"
                            >
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <service.icon className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <Label className="text-sm font-medium">
                                  {service.label}
                                </Label>
                              </div>
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">About</h3>

                    <div className="space-y-6">
                      {/* About Description */}
                      <div>
                        <Label htmlFor="aboutDescription">Description</Label>
                        <Textarea
                          id="aboutDescription"
                          placeholder="Description here"
                          value={formData.about?.description || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              about: {
                                ...(prev.about ?? {}),
                                description: e.target.value,
                                videoTitle: prev.about?.videoTitle ?? "",
                                videoDescription:
                                  prev.about?.videoDescription ?? "",
                              },
                            }))
                          }
                          className="min-h-[120px]"
                        />
                      </div>

                      {/* Video Title */}
                      <div>
                        <Label htmlFor="videoTitle">Video Title</Label>
                        <Input
                          id="videoTitle"
                          placeholder="Title here"
                          value={formData.about?.videoTitle || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              about: {
                                ...(prev.about ?? {}),
                                videoTitle: e.target.value,
                                description: prev.about?.description ?? "",
                                videoDescription:
                                  prev.about?.videoDescription ?? "",
                              },
                            }))
                          }
                        />
                      </div>

                      {/* Video Description */}
                      <div>
                        <Label htmlFor="videoDescription">
                          Video Description
                        </Label>
                        <Textarea
                          id="videoDescription"
                          placeholder="Write here"
                          value={formData.about?.videoDescription || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              about: {
                                ...(prev.about ?? {}),
                                videoDescription: e.target.value,
                                description: prev.about?.description ?? "",
                                videoTitle: prev.about?.videoTitle ?? "",
                              },
                            }))
                          }
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Upload Video UI */}
                      <div>
                        <Label>Upload Video</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Browse and choose the files you want to upload from
                            your computer
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 bg-transparent"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Times */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">
                      Available Times
                    </h3>

                    <div className="space-y-6">
                      {/* Time Inputs */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Hours</Label>
                          <Input
                            type="number"
                            min="1"
                            max="12"
                            defaultValue="06"
                            className="text-center"
                          />
                        </div>
                        <div>
                          <Label>Minutes</Label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            defaultValue="00"
                            className="text-center"
                          />
                        </div>
                        <div>
                          <Label>Period</Label>
                          <Select defaultValue="PM">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-4">
                        {[
                          { time: "12:00 PM", id: "1" },
                          { time: "11:00 AM", id: "2" },
                          { time: "10:00 AM", id: "3" },
                          { time: "09:00 AM", id: "4" },
                          { time: "11:30 AM", id: "5" },
                        ].map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="font-medium">{slot.time}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4">
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
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Right Column - Photo Upload */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-8">
                    <Label className="text-base font-semibold">
                      Upload Photo
                    </Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Browse and choose the files you want to upload from your
                      computer
                    </p>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <Button type="button" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg relative"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
