"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // 👁️ icons

// ✅ Zod Schema for validation
const signupSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type SignupSchema = z.infer<typeof signupSchema>;

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (password: string) => resetPassword(password, token),
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(`/login`);
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
  });

  const onsubmit = (values: SignupSchema) => {
    registerMutation.mutate(values.password);
  };

  return (
    <section>
      <div className="">
        {/* back to home  */}
        <button
          onClick={() => router.push("/")}
          className="absolute flex gap-2 items-center top-24 right-28 md:right-48 text-[#6C757D] hover:border-b border-gray-500 cursor-pointer"
        >
          <ArrowLeft /> Back to Home
        </button>

        <div className="grid md:grid-cols-2 items-center h-svh">
          {/* Left side - image */}
          <div className="bg-center">
            <Image
              src={"/loginimage.png"}
              alt="signup"
              width={600}
              height={600}
              className="h-svh w-full object-cover"
            />
            <div className="absolute top-6 left-6 text-white text-2xl font-bold">
              <Image src="/login.png" alt="logo" width={155} height={48} />
            </div>
          </div>

          {/* Right side - form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-2xl md:text-[40px] font-playfair leading-[150%] font-bold text-green-600">
                Change Password
              </h2>
              <p className="text-sm md:-[16px] text-[#6C757D] mb-6 md:mb-[40px]">
                Connect families with trusted care join ALH Hub today.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onsubmit)}
                  className="space-y-4"
                >
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">Create New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending
                      ? "Changing Password..."
                      : "Change Password"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
