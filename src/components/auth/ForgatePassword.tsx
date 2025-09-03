"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { forgatePassword } from "@/lib/auth"; // ✅ Your API call
import { useState } from "react";

// ✅ Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const ForgatePassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  // ✅ React Query mutation
  const forgateMutation = useMutation({
    mutationFn: (email: string) => forgatePassword(email),
    onSuccess: (data: { message: string; email: string }) => {
      toast.success(data.message || "OTP sent to your email");
      router.push(`/forget-otp?email=${email}`);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to send OTP");
    },
  });

  const onSubmit = (values: LoginSchema) => {
    setEmail(values.email);
    forgateMutation.mutate(values.email);
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2 relative">
      {/* back to home  */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 md:top-16 right-16 md:right-48  text-[#6C757D]  hover:underline cursor-pointer"
      >
        Back to Home
      </button>

      {/* Left side image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative hidden lg:block"
      >
        <Image
          src="/loginimage.png"
          alt="Login background"
          width={800}
          height={800}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-6 left-6 text-white text-2xl font-bold">
          <Image src="/login.png" alt="logo" width={155} height={48} />
        </div>
      </motion.div>

   

      {/* Right side form */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md">
          <h2 className="text-3xl md:text-[40px] font-playfair font-bold text-green-600 mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-500 mb-6">
            Enter your email to recover your password
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">Email Address</FormLabel>
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

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
                disabled={forgateMutation.isPending}
              >
                {forgateMutation.isPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgatePassword;
