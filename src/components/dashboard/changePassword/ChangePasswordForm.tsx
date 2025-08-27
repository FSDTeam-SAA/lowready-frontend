"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordRequirement {
  text: string
  met: boolean
}

export function ChangePassword() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    console.log("Session:", session)
    console.log("Access Token:", session?.accessToken)
  }, [session])

  // Password validation requirements
  const getPasswordRequirements = (password: string): PasswordRequirement[] => [
    { text: "Minimum 8 characters (recommend 12+ for stronger security).", met: password.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { text: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { text: "At least one number (0-9)", met: /\d/.test(password) },
    { text: "At least one special character (!@#$%^&* etc.)", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: "No spaces allowed", met: !/\s/.test(password) },
  ]

  const passwordRequirements = getPasswordRequirements(formData.newPassword)
  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const doPasswordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword !== ""

  // Use React Query mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      if (!session?.accessToken) throw new Error("You are not authenticated. Please log in.")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: data.currentPassword.trim(), // API expects oldPassword
          newPassword: data.newPassword.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to change password")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully")
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message)
      else toast.error("An unknown error occurred")
    },
  })

  // Loading state helper
const isSaving = changePasswordMutation.status === "pending"


  const handleInputChange = (field: keyof ChangePasswordData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid) {
      toast.error("Please meet all password requirements")
      return
    }
    if (!doPasswordsMatch) {
      toast.error("New password and confirm password do not match")
      return
    }
    changePasswordMutation.mutate(formData)
  }

  const handleDiscard = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  if (status === "unauthenticated") {
    return (
      <Card className="w-full mx-auto">
        <CardContent>
          <p className="text-center text-red-500">You must be logged in to change your password.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full mx-auto ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Change Password</CardTitle>
        <CardDescription>Manage your account preferences, security settings, and privacy options.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                  placeholder="********"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  placeholder="********"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="********"
                className={!doPasswordsMatch && formData.confirmPassword !== "" ? "border-red-500" : ""}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="space-y-2">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  {requirement.met ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className={requirement.met ? "text-green-600" : "text-red-500"}>
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleDiscard} disabled={isSaving}>
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={!formData.currentPassword || !isPasswordValid || !doPasswordsMatch || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
