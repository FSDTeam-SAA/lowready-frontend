"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { changePassword } from "@/lib/api";
import { cn } from "@/lib/utils";
import DashboardLayout from "./profile-dashboard-layout";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must be at most 12 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .refine((val) => !/\s/.test(val), "Password must not contain spaces"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ChangePasswordPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = watch("newPassword", "");

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      reset();
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const handleDiscard = () => {
    reset();
    toast.info("Changes discarded");
  };

  // Password validation checks
  const validationChecks = [
    {
      label: "Minimum 8-12 characters (recommend 12+ for stronger security)",
      isValid: newPassword.length >= 8 && newPassword.length <= 12,
      isRecommended: newPassword.length >= 12,
    },
    {
      label: "At least one uppercase letter must",
      isValid: /[A-Z]/.test(newPassword),
    },
    {
      label: "At least one lowercase letter must",
      isValid: /[a-z]/.test(newPassword),
    },
    {
      label: "At least one number must (0-9)",
      isValid: /[0-9]/.test(newPassword),
    },
    {
      label: "At least special character (! @ # $ % ^ & * etc.)",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      isInvalid:
        /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) === false &&
        newPassword.length > 0,
    },
    {
      label: "No spaces allowed",
      isValid: !/\s/.test(newPassword) && newPassword.length > 0,
      isInvalid: /\s/.test(newPassword),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Card */}
          <Card className="lg:w-1/3">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-[#7cc245] rounded-lg mx-auto relative overflow-hidden">
                  <Avatar className="w-full h-full rounded-lg">
                    <AvatarImage
                      src="/professional-woman-diverse.png"
                      alt="Olivia Rhye"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#7cc245] text-white text-2xl rounded-lg">
                      OR
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div>
                  <h2 className="text-xl font-semibold alnhub-primary">
                    Olivia Rhye
                  </h2>
                  <p className="text-[#68706a]">bessieedwards@gmail.com</p>
                </div>

                <div className="space-y-2 text-left text-sm">
                  <div>
                    <span className="font-medium">Name:</span> Olivia Rhye
                  </div>
                  <div>
                    <span className="font-medium">Bio:</span> Fashion designer
                    passionate about creating styles that celebrate
                    individuality and comfort.
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>{" "}
                    bessieedwards@gmail.com
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span> +1 (555)
                    123-4567
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> 1234 Oak
                    Avenue, San Francisco, CA 94102A
                  </div>
                  <div>
                    <span className="font-medium">Since:</span> 14 August, 2025
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card className="lg:w-2/3">
            <CardHeader>
              <CardTitle>Changes Password</CardTitle>
              <p className="text-[#68706a]">
                Manage your account preferences, security settings, and privacy
                options.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...register("oldPassword")}
                      className={
                        errors.oldPassword ? "border-[#e5102e] pr-10" : "pr-10"
                      }
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-[#68706a]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#68706a]" />
                      )}
                    </Button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword")}
                      className={
                        errors.newPassword ? "border-[#e5102e] pr-10" : "pr-10"
                      }
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-[#68706a]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#68706a]" />
                      )}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={
                        errors.confirmPassword
                          ? "border-[#e5102e] pr-10"
                          : "pr-10"
                      }
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-[#68706a]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#68706a]" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-[#e5102e]">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="space-y-3">
                  {validationChecks.map((check, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      {check.isInvalid ? (
                        <X className="h-4 w-4 text-[#e5102e] flex-shrink-0" />
                      ) : check.isValid ? (
                        <Check className="h-4 w-4 text-[#179649] flex-shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 text-[#68706a] flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          check.isInvalid
                            ? "text-[#e5102e]"
                            : check.isValid
                            ? "text-[#179649]"
                            : "text-[#68706a]"
                        )}
                      >
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDiscard}
                    className="flex-1 md:flex-none border-[#e5102e] text-[#e5102e] hover:bg-[#feecee] bg-transparent"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="flex-1 md:flex-none bg-[#179649] hover:bg-[#33b34c]"
                  >
                    {changePasswordMutation.isPending
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
