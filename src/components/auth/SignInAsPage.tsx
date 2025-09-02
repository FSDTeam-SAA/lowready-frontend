"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignInAsPage = () => {
  const router = useRouter();
  return (
    <section>
      <div className="min-h-screen  flex flex-col">
        {/* Header */}
        <header className=" px-8 py-4 shadow-2xl">
          <div className=" container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">Alh Hub</h1>
            <Button
              variant="default"
              className="bg-green-600  cursor-pointer hover:bg-green-700"
              onClick={() => router.push("/")}
            >
              Back To Home
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 container mx-auto justify-center items-center px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  w-full">
            {/* Facility Provider Card */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle>
                  Sign In as a{" "}
                  <span className="text-green-600">Facility Provider</span>
                </CardTitle>
                <CardDescription>
                  Manage your facilities, bookings, and grow your business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Browse and book services instantly</li>
                  <li>Track your requests and bookings</li>
                  <li>Easy payment and secure transactions</li>
                  <li>Access exclusive offers and discounts</li>
                  <li>Manage your profile and saved addresses</li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 cursor-pointer hover:bg-green-600 hover:text-white"
                  onClick={() => router.push("/signup?role=organization")}
                >
                  Continue as Provider
                </Button>
              </CardContent>
            </Card>

            {/* User Card */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
              <CardHeader>
                <CardTitle>
                  Sign In as a <span className="text-green-600">User</span>
                </CardTitle>
                <CardDescription>
                  Book facilities, services, and manage your requests easily.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                  <li>Browse and book services instantly</li>
                  <li>Track your requests and bookings</li>
                  <li>Easy payment and secure transactions</li>
                  <li>Access exclusive offers and discounts</li>
                  <li>Manage your profile and saved addresses</li>
                </ul>
                <Button
                  className="w-full bg-green-600 cursor-pointer hover:bg-green-700"
                  onClick={() => router.push("/signup?role=user")}
                >
                  Continue as User
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignInAsPage;
