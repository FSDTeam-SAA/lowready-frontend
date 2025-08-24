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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react"; // 👈 added

// ✅ Zod Schema for validation
const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type SignupSchema = z.infer<typeof signupSchema>;

const SingupForm = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "user";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      role: string;
    }) => registerUser(data),
  });

  const onsubmit = async (values: SignupSchema) => {
    await registerMutation.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: role,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push(`/verify-otp?email=${data?.data?.email}`);
        },
        onError: (error) => {
          if (error instanceof Error) {
            toast.error(error.message);
          }
        },
      }
    );
  };

  return (
    <section>
      <div className="">
        {/* back to home */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-24 right-28 md:right-48 text-green-600 hover:underline cursor-pointer"
        >
          Back to Home
        </button>

        <div className="grid lg:grid-cols-2 items-center h-svh">
          {/* Left side - image */}
          <div className="bg-center hidden lg:block">
            <Image
              src={"/signup.png"}
              alt="signup"
              width={600}
              height={600}
              className="h-svh w-full object-cover"
            />
          </div>

          {/* Right side - form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-lg px-2 md:px-3 lg:px-0">
              <h2 className="text-2xl font-bold text-green-600">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Connect families with trusted care join ALH Hub today.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onsubmit)}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name Here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name Here" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hello@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password field with toggle */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm password with toggle */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-gray-600">
                          I agree to ALH Hub&apos;s{" "}
                          <a href="/terms" className="text-green-600 underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
                            className="text-green-600 underline"
                          >
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </Form>

              <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-green-600 font-medium cursor-pointer"
                >
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingupForm;
