"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { getSession, signIn } from "next-auth/react"; // ✅ NextAuth import

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
      console.log("res: ", res);
      toast.success("Login successful!");
      const session = await getSession();

      console.log("session: ", session);

      if (session?.user?.role === "admin") {
        router.push("/dashboard");
      } else if (session?.user?.role === "organization") {
        router.push("/organization/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <section className="min-h-screen grid md:grid-cols-2">
      {/* Left side image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative hidden md:block"
      >
        <Image
          src="/signup.png"
          alt="Login background"
          width={800}
          height={800}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-6 left-6 text-white text-2xl font-bold">
          ALH Hub
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
          <h2 className="text-3xl font-bold text-green-600 mb-2">Welcome</h2>
          <p className="text-gray-500 mb-6">
            Access your account to manage tours, leads, and listings
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm">Remember me</FormLabel>
                    </FormItem>
                  )}
                />

                <a
                  href="/forgot-password"
                  className="text-green-600 text-sm hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Log In
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a
              href="/signup?role=user"
              className="text-green-600 font-medium hover:underline"
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
