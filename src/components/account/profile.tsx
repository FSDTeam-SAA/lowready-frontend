/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/api";
import { useSession } from "next-auth/react";
import DashboardLayout from "./profile-dashboard-layout";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female"]),
  bio: z.string().optional(),
  street: z.string().min(1, "Street address is required"),
  location: z.string().min(1, "Location is required"),
  postCode: z.string().min(1, "Postal code is required"),
  phoneNum: z.string().min(1, "Phone number is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const userProfile: any | null = session?.user
    ? {
        _id: "mock-id",
        firstName: session.user.name?.split(" ")[0] || "Olivia",
        lastName: session.user.name?.split(" ")[1] || "Rhye",
        email: session.user.email || "bessieadwards@gmail.com",
        gender: "female" as const,
        bio: "Fashion designer passionate about creating styles that celebrate individuality and comfort.",
        street: "1234 Oak Avenue, San Francisco, CA 94102A",
        postCode: 30301,
        phoneNum: "+1 (555) 123-4567",
        avatar: {
          url: session.user.image || "/abstract-profile.png",
          public_id: "mock-public-id",
        },
        createdAt: "2025-08-21T19:24:00.739Z",
        updatedAt: "2025-08-21T19:55:43.959Z",
        role: "user",
        fine: 0,
        refresh_token: "",
        dateOfBirth: "1990-01-01",
      }
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: userProfile
      ? {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          gender: userProfile.gender,
          bio: userProfile.bio || "",
          street: userProfile.street,
          location: "Florida, USA",
          postCode: userProfile.postCode?.toString() || "",
          phoneNum: userProfile.phoneNum,
        }
      : undefined,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phoneNum", data.phoneNum);
    formData.append("address", data.street);
    if (data.bio) formData.append("bio", data.bio);
    if (data.postCode) formData.append("postCode", data.postCode);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    updateProfileMutation.mutate(formData);
  };

  const handleDiscard = () => {
    reset();
    setSelectedFile(null);
    setPreviewUrl(null);
    toast.info("Changes discarded");
  };

  if (!userProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#179649]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <Card className="lg:w-1/3">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-[#7cc245] rounded-lg mx-auto relative overflow-hidden">
                    <Avatar className="w-full h-full rounded-lg">
                      <AvatarImage
                        src={previewUrl || userProfile?.avatar?.url}
                        alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-[#7cc245] text-white text-2xl rounded-lg">
                        {userProfile?.firstName?.[0]}
                        {userProfile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#179649] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#33b34c] transition-smooth"
                  >
                    <Edit className="h-4 w-4 text-white" />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold alnhub-primary">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </h2>
                  <p className="text-[#68706a]">{userProfile?.email}</p>
                </div>

                <div className="space-y-2 text-left">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {userProfile?.firstName} {userProfile?.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Bio:</span>{" "}
                    {userProfile?.bio || "No bio available"}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    {userProfile?.email}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {userProfile?.phoneNum}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>{" "}
                    {userProfile?.street}
                  </div>
                  <div>
                    <span className="font-medium">Since:</span> 14 August, 2025
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:w-2/3">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <p className="text-[#68706a]">
                Manage your personal information and profile details.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Gender Selection */}
                <div className="space-y-3">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={watch("gender")}
                    onValueChange={(value) =>
                      setValue("gender", value as "male" | "female")
                    }
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
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className={errors.firstName ? "border-[#e5102e]" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-[#e5102e]">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className={errors.lastName ? "border-[#e5102e]" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-[#e5102e]">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-[#e5102e]" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    {...register("bio")}
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    {...register("street")}
                    className={errors.street ? "border-[#e5102e]" : ""}
                  />
                  {errors.street && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      className={errors.location ? "border-[#e5102e]" : ""}
                    />
                    {errors.location && (
                      <p className="text-sm text-[#e5102e]">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postCode">Postal Code</Label>
                    <Input
                      id="postCode"
                      {...register("postCode")}
                      className={errors.postCode ? "border-[#e5102e]" : ""}
                    />
                    {errors.postCode && (
                      <p className="text-sm text-[#e5102e]">
                        {errors.postCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNum">Phone Number</Label>
                  <Input
                    id="phoneNum"
                    {...register("phoneNum")}
                    className={errors.phoneNum ? "border-[#e5102e]" : ""}
                  />
                  {errors.phoneNum && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.phoneNum.message}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDiscard}
                    disabled={!isDirty && !selectedFile}
                    className="flex-1 md:flex-none bg-transparent"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      updateProfileMutation.isPending ||
                      (!isDirty && !selectedFile)
                    }
                    className="flex-1 md:flex-none bg-[#179649] hover:bg-[#33b34c]"
                  >
                    {updateProfileMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
