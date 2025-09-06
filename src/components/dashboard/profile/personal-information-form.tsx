"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type FormDataType = {
  gender: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNum: string;
  bio: string;
  address: string;
  location: string;
  postCode: string;
  photo: File | string | null;
};

const initialFormData: FormDataType = {
  gender: "female",
  firstName: "Olivia",
  lastName: "Rhye",
  email: "bessieedwards@gmail.com",
  phoneNum: "+1 (555) 123-4567",
  bio: "This is  ipsum dolor sit amet, consectetur adipiscing elit.",
  address: "1234 Oak Avenue, San Francisco, CA 94102A",
  location: "Florida, USA",
  postCode: "30301",
  photo: null,
};

const updateUserProfile = async (
  userData: FormDataType,
  accessToken: string
) => {
  if (!accessToken) throw new Error("Session expired. Please login again.");

  const formData = new FormData();
  formData.append("firstName", userData.firstName);
  formData.append("lastName", userData.lastName);
  formData.append("email", userData.email);
  formData.append("phoneNum", userData.phoneNum);
  formData.append("bio", userData.bio);
  formData.append("address", userData.address);
  formData.append("location", userData.location);
  formData.append("postCode", userData.postCode);
  if (userData.photo instanceof File) {
    formData.append("photo", userData.photo);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/update`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    if (response.status === 401)
      throw new Error("Session expired. Please login again.");
    throw new Error("Failed to update profile");
  }

  return response.json();
};

export function PersonalInformationForm() {
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const updateProfileMutation = useMutation({
    mutationFn: () => updateUserProfile(formData, session?.accessToken || ""),
    onSuccess: (data) => {
      toast.success("Profile updated successfully!", data);
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(msg);
    },
  });

  const handleInputChange = (
    field: keyof FormDataType,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => updateProfileMutation.mutate();
  const handleDiscard = () => {
    setFormData(initialFormData);
    setHasChanges(false);
  };


  return (
    <div className="overflow-hidden ">
      <Card className="overflow-hidden p-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            <p className="text-sm text-gray-600">
              Manage your personal information and profile details.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 hover:bg-green-100"
          >
            <Crown className="mr-1 h-3 w-3" />
            Subscribed
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Gender */}
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>

          {/* Text Inputs - 2x2 Grid Layout */}
          <div className="grid grid-cols-2 gap-4">
            {["firstName", "lastName", "email", "phoneNum"].map((field) => (
              <div key={field} className="space-y-2">
                <Label className="capitalize text-sm font-medium text-gray-700">
                  {field}
                </Label>
                <Input
                  type={field === "email" ? "email" : "text"}
                  value={formData[field as keyof FormDataType] as string}
                  onChange={(e) =>
                    handleInputChange(
                      field as keyof FormDataType,
                      e.target.value
                    )
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Remaining inputs below */}
          {["bio", "address", "location", "postCode"].map((field) => (
            <div key={field} className="space-y-2">
              <Label className="capitalize text-sm font-medium text-gray-700">
                {field}
              </Label>
              {field === "bio" ? (
                <textarea
                  value={formData[field as keyof FormDataType] as string}
                  onChange={(e) =>
                    handleInputChange(
                      field as keyof FormDataType,
                      e.target.value
                    )
                  }
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <Input
                  type="text"
                  value={formData[field as keyof FormDataType] as string}
                  onChange={(e) =>
                    handleInputChange(
                      field as keyof FormDataType,
                      e.target.value
                    )
                  }
                  className="w-full"
                />
              )}
            </div>
          ))}

          {/* Photo Upload */}
          <div className="space-y-2 ">
            <Label className="text-sm font-medium text-gray-700">
              Profile Photo
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleInputChange("photo", e.target.files?.[0] || null)
              }
            />
            {formData.photo instanceof File && (
              <p className="text-xs text-gray-500">
                Selected: {formData.photo.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={!hasChanges}
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
