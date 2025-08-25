// "use client";

// import type React from "react";
// import { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// import { AlertCircle, Camera } from "lucide-react";
// import { toast } from "sonner";
// import Image from "next/image";
// import { z } from "zod";

// // Validation schema
// const profileSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.string().email("Invalid email format"),
//   phone: z.string().optional(),
//   country: z.string().optional(),
//   cityOrState: z.string().optional(),
// });

// const imageSchema = z.object({
//   size: z.number().max(5 * 1024 * 1024, "Image must be less than 5MB"),
//   type: z.enum(["image/jpeg", "image/png", "image/gif"], {
//     errorMap: () => ({
//       message: "Only JPG, PNG, and GIF formats are supported",
//     }),
//   }),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;

// export function AdminProfileForm() {
//   const queryClient = useQueryClient();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<string>("");

//   const { data: userData, isLoading } = useQuery({
//     queryKey: ["userProfile"],
//     queryFn: fetchUserProfile,
//     select: (data) => data.data,
//   });

//   const form = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       country: "",
//       cityOrState: "",
//     },
//   });

//   // Reset form with user data when userData is loaded
//   useEffect(() => {
//     if (userData) {
//       form.reset({
//         firstName: userData.firstName || "",
//         lastName: userData.lastName || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         country: userData.country || "",
//         cityOrState: userData.cityOrState || "",
//       });
//     }
//   }, [userData, form]);

//   const updateMutation = useMutation({
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mutationFn: ({ data, image }: { data: any; image?: File }) =>
//       updateUserProfile(data, image),
//     onSuccess: () => {
//       toast.success("Profile updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       setSelectedImage(null);
//       setImagePreview(null);
//       setImageError("");
//       window.location.reload();
//     },
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     onError: (error: any) => {
//       toast.error(error.message || "Failed to update profile");
//     },
//   });

//   const validateImage = (file: File): string | null => {
//     try {
//       imageSchema.parse({
//         size: file.size,
//         type: file.type,
//       });
//       return null;
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return error.errors[0].message;
//       }
//       return "Invalid image file";
//     }
//   };

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const imageValidationError = validateImage(file);
//       if (imageValidationError) {
//         setImageError(imageValidationError);
//         setSelectedImage(null);
//         setImagePreview(null);
//         return;
//       }

//       setImageError("");
//       setSelectedImage(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setImagePreview(e.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const onSubmit = (data: ProfileFormData) => {
//     if (selectedImage && imageError) {
//       toast.error("Please fix the image error before submitting");
//       return;
//     }

//     const updateData = {
//       firstName: data.firstName,
//       lastName: data.lastName,
//       phone: data.phone || "",
//       country: data.country || "",
//       cityOrState: data.cityOrState || "",
//     };

//     updateMutation.mutate({
//       data: updateData,
//       image: selectedImage || undefined,
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="p-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 bg-gray-200 rounded w-48"></div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="space-y-2">
//                 <div className="h-4 bg-gray-200 rounded w-24"></div>
//                 <div className="h-10 bg-gray-200 rounded"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Left side - Form */}
//         <div className="flex-1">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Personal Information
//             </h2>
//           </div>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <FormField
//                   control={form.control}
//                   name="firstName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">
//                         First Name
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="Bessie"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="lastName"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">Last Name</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="Edwards"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">
//                         Email Address
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           type="email"
//                           placeholder="danieledwards@gmail.com"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">Phone</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="(307) 555-0133"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="country"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">Country</FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="USA"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="cityOrState"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-gray-700">
//                         City/State
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           {...field}
//                           placeholder="Alabama"
//                           className="bg-white"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button
//                   type="submit"
//                   className="bg-sky-500 hover:bg-sky-600 px-8"
//                   disabled={updateMutation.isPending}
//                 >
//                   {updateMutation.isPending ? "Saving..." : "Save"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>

//         {/* Right side - Profile Picture */}
//         <div className="lg:w-80">
//           <div className="text-center">
//             <div className="inline-block mb-4">
//               <Image
//                 src={imagePreview || userData?.imageLink}
//                 alt="Profile picture"
//                 width={600}
//                 height={600}
//                 className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
//               />
//             </div>

//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               {userData?.firstName && userData?.lastName
//                 ? `${userData.firstName} ${userData.lastName}`
//                 : "Bessie Edwards"}
//             </h3>

//             <Button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm flex items-center gap-2 mx-auto"
//             >
//               <Camera className="h-4 w-4" />
//               Edit Image
//             </Button>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="hidden"
//             />

//             {imageError && (
//               <div className="flex items-center justify-center gap-1 text-red-600 text-sm mt-2">
//                 <AlertCircle className="h-4 w-4" />
//                 {imageError}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }