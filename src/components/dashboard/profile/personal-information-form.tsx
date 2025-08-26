"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import { toast } from "sonner"

const initialFormData = {
  gender: "female",
  firstName: "Olivia",
  lastName: "Rhye",
  email: "bessieedwards@gmail.com",
  phoneNum: "+1 (555) 123-4567",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique et sed mauris. Phasellus urna magna, cursus at mi eu, dapibus porta nisl.",
  street: "1234 Oak Avenue, San Francisco, CA 94102A",
  location: "Florida, USA",
  postCode: "30301",
}

const updateUserProfile = async (userData: typeof initialFormData) => {
  const token = localStorage.getItem("accessToken")

  if (!token) {
    throw new Error("No access token found. Please login again.")
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNum: userData.phoneNum,
      bio: userData.bio,
      street: userData.street,
      postCode: Number.parseInt(userData.postCode),
      gender: userData.gender,
    }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      throw new Error("Session expired. Please login again.")
    }
    throw new Error("Failed to update profile")
  }

  return response.json()
}

export function PersonalInformationForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [hasChanges, setHasChanges] = useState(false)
  const queryClient = useQueryClient()

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data)
      toast.success("Profile updated successfully!")
      setHasChanges(false)
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
    },
    onError: (error) => {
      console.error("Error updating profile:", error)
      if (error.message.includes("login again")) {
        toast.error("Session expired. Please login again.")
        // Redirect to login page or trigger login modal
        window.location.href = "/login"
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    },
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    updateProfileMutation.mutate(formData)
  }

  const handleDiscard = () => {
    setFormData(initialFormData)
    setHasChanges(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600">Manage your personal information and profile details.</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
          <Crown className="mr-1 h-3 w-3" />
          Subscribed
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gender Selection */}
        <div className="space-y-3">
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="text-sm font-medium">
                Male
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="text-sm font-medium">
                Female
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              value={formData.phoneNum}
              onChange={(e) => handleInputChange("phoneNum", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
            Bio
          </Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="min-h-[100px] w-full resize-none"
          />
        </div>

        {/* Street Address */}
        <div className="space-y-2">
          <Label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
            Street Address
          </Label>
          <Input
            id="streetAddress"
            value={formData.street}
            onChange={(e) => handleInputChange("street", e.target.value)}
            className="w-full"
          />
        </div>

        {/* Location and Postal Code */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              Postal Code
            </Label>
            <Input
              id="postalCode"
              value={formData.postCode}
              onChange={(e) => handleInputChange("postCode", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={!hasChanges || updateProfileMutation.isPending}
            className="px-6 bg-transparent"
          >
            Discard Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || updateProfileMutation.isPending}
            className="bg-green-600 px-6 hover:bg-green-700"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
