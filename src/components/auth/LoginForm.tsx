"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react"; // 👈 added icons

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
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginSchema = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // ✅ Handle login with NextAuth
  const onSubmit = async (values: LoginSchema) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      toast.error(res.error || "Invalid email or password");
    } else {
      
      toast.success("Login successful!");
      type SessionUserWithRole = {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
      };

      const session = await getSession();
      

      const user = session?.user as SessionUserWithRole | undefined;

      if (user?.role === "organization") {
        router.push("/dashboard");
      } else if (user?.role === "organization") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <section className="min-h-screen grid lg:grid-cols-2">
      {/* back to home  */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-8 md:top-16 right-16 md:right-48 flex gap-2 border-gray-500  text-[#6C757D] hover:border-b cursor-pointer"
      >
       <ArrowLeft /> Back to Home
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
          <Image src='/login.png' alt="logo" width={155} height={48}  />
        </div>
      </motion.div>

      {/* Right side form */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6 px-3 md:px-4 lg:px-0"
      >
        <div className="w-full max-w-lg">
          <h2 className="text-3xl md:text-[40px] font-bold leading-[150%] font-playfair text-green-600 mb-2">Welcome</h2>
          <p className="text-gray-500 mb-6">
            Access your account to manage tours, leads, and listings
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

              {/* Password with toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input className=""
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember + Forgot */}
              <div className="flex justify-between cursor-pointer items-center">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox className="cursor-pointer"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-[16px] text-[#6C757D]">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                <a
                  href="/forget-password"
                  className="text-green-600 text-sm  border-b border-gray-400 cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                Log In
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signinaspage"
              className="text-green-600 font-medium hover:underline cursor-pointer"
            >
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default LoginForm;
