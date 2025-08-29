// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import {
//   Eye,
//   Trash2,
//   FileText,
//   ImageIcon,
//   File,
//   Plus,
//   UploadCloud,
// } from "lucide-react";
// // import { cn } from "@/lib/utils";
// import Image from "next/image";

// interface Document {
//   _id: string;
//   file: { url: string; public_id: string };
//   uploader: { _id: string; firstName: string; lastName: string; email: string };
//   type: string;
//   createdAt: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
// }

// interface ErrorResponse {
//   message: string;
// }

// const BASE_API = process.env.NEXT_PUBLIC_API_URL;

// export function DocumentManager() {
//   const { data: session } = useSession();
//   const queryClient = useQueryClient();
//   const uploaderId = session?.user?.id || "";

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [documentType, setDocumentType] = useState("");
//   const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

//   // Fetch documents
//   const { data: documentsResponse, isLoading } = useQuery({
//     queryKey: ["documents"],
//     queryFn: async (): Promise<ApiResponse<Document[]>> => {
//       const res = await fetch(`${BASE_API}/document`); // Changed from /document/ to /document
//       if (!res.ok) throw new Error("Failed to fetch documents");
//       return res.json();
//     },
//   });

//   // Upload mutation - Fixed endpoint and error handling
//   const uploadMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       try {
//         const res = await fetch(`${BASE_API}/document/upload`, {
//           // Changed endpoint
//           method: "POST",
//           body: formData,
//         });

//         if (!res.ok) {
//           const errorData: ErrorResponse = await res
//             .json()
//             .catch(() => ({ message: "Upload failed" }));
//           console.log(errorData);
//           throw new Error(
//             errorData.message || `Upload failed with status ${res.status}`
//           );
//         }

//         return res.json();
//       } catch (error) {
//         if (error instanceof Error) {
//           throw error;
//         }
//         throw new Error("Unknown upload error occurred");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["documents"] });
//       setSelectedFile(null);
//       setDocumentType("");
//       toast.success("Document uploaded successfully");
//     },
//     onError: (err: Error) => toast.error(err.message || "Upload failed"),
//   });

//   // Delete mutation - Fixed endpoint and error handling
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       try {
//         const res = await fetch(`${BASE_API}/document/${id}`, {
//           // Changed endpoint
//           method: "DELETE",
//         });

//         if (!res.ok) {
//           const errorData: ErrorResponse = await res
//             .json()
//             .catch(() => ({ message: "Delete failed" }));
//           throw new Error(
//             errorData.message || `Delete failed with status ${res.status}`
//           );
//         }

//         return res.json();
//       } catch (error) {
//         if (error instanceof Error) {
//           throw error;
//         }
//         throw new Error("Unknown delete error occurred");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["documents"] });
//       toast.success("Document deleted successfully");
//     },
//     onError: (err: Error) => toast.error(err.message || "Delete failed"),
//   });

//   const handleFileSelect = (file: File) => {
//     const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//     if (!allowedTypes.includes(file.type))
//       return toast.error("Only PDF, JPG, PNG files are allowed");
//     if (file.size > 10 * 1024 * 1024)
//       return toast.error("File size must be less than 10MB");
//     setSelectedFile(file);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       handleFileSelect(e.target.files[0]);
//     }
//   };

//   const handleUpload = () => {
//     if (!selectedFile) return toast.error("Please select a file");
//     if (!documentType) return toast.error("Please select a document type");
//     if (!uploaderId) return toast.error("User not authenticated");

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("type", documentType);
//     formData.append("uploader", uploaderId);

//     uploadMutation.mutate(formData);
//   };

//   const handleDelete = (id: string) => {
//     if (confirm("Are you sure you want to delete this document?"))
//       deleteMutation.mutate(id);
//   };

//   const handleView = (doc: Document) => setViewingDocument(doc);

//   const getFileIcon = (name: string) => {
//     if (name.endsWith(".pdf")) return <FileText className="h-4 w-4" />;
//     if (
//       name.endsWith(".jpg") ||
//       name.endsWith(".png") ||
//       name.endsWith(".jpeg")
//     )
//       return <ImageIcon className="h-4 w-4" />;
//     return <File className="h-4 w-4" />;
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
//   };

//   const documents = documentsResponse?.data || [];

//   return (
//     <div className="space-y-6">
//       {/* Upload Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Business & License Documents</CardTitle>
//           <CardDescription>
//             Business registration and licensing documentation
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5">
//             <Input
//               type="file"
//               accept=".pdf,.jpg,.jpeg,.png"
//               onChange={handleInputChange}
//               className="hidden"
//               id="file-upload"
//             />
//             <Label
//               htmlFor="file-upload"
//               className="flex flex-col items-center justify-center cursor-pointer"
//             >
//               <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 mb-2">
//                 <Plus className="h-6 w-6" />
//               </div>
//               <p className="tex-sm">
//                 Browse and chose the files you want to upload from your computer
//               </p>
//               <UploadCloud />
//               <p className="text-base">Click to select a file</p>
//               <p className="text-xs text-muted-foreground mt-2">
//                 Supported: PDF, JPG, PNG (Max 10MB)
//               </p>
//             </Label>
//           </div>

//           {/* Selected File Preview */}
//           {selectedFile && (
//             <div className="space-y-4 p-4 border rounded-lg bg-muted/50 mt-4">
//               <div className="flex items-center gap-2">
//                 {getFileIcon(selectedFile.name)}
//                 <span className="text-sm font-medium">{selectedFile.name}</span>
//                 <span className="text-xs text-muted-foreground">
//                   ({formatFileSize(selectedFile.size)})
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="document-type">Document Type</Label>
//                 <Select value={documentType} onValueChange={setDocumentType}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select document type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Identity & Legal Documents">
//                       Identity & Legal Documents
//                     </SelectItem>
//                     <SelectItem value="Business Registration">
//                       Business Registration
//                     </SelectItem>
//                     <SelectItem value="License Documents">
//                       License Documents
//                     </SelectItem>
//                     <SelectItem value="Financial Documents">
//                       Financial Documents
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex gap-2 mt-2">
//                 <Button
//                   onClick={handleUpload}
//                   className="flex-1 bg-primary text-white hover:bg-primary/80"
//                   disabled={uploadMutation.isPending}
//                 >
//                   {uploadMutation.isPending ? "Uploading..." : "Upload"}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setSelectedFile(null);
//                     setDocumentType("");
//                   }}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>

//         {/* Uploaded Documents */}

//         <CardHeader>
//           <CardTitle>Uploaded Documents</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <p className="text-center py-8 text-muted-foreground">
//               Loading documents...
//             </p>
//           ) : documents.length === 0 ? (
//             <p className="text-center py-8 text-muted-foreground">
//               No documents uploaded yet
//             </p>
//           ) : (
//             <div className="space-y-3">
//               {documents.map((doc) => (
//                 <div
//                   key={doc._id}
//                   className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
//                 >
//                   <div className="flex items-center gap-3">
//                     {getFileIcon(doc.file.url)}
//                     <div>
//                       <p className="font-medium text-sm">{doc.type}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleView(doc)}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDelete(doc._id)}
//                       disabled={deleteMutation.isPending}
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

      
//       {/* Document Preview Modal */}
//       <Dialog
//         open={!!viewingDocument}
//         onOpenChange={() => setViewingDocument(null)}
//       >
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-between">
//               <span>{viewingDocument?.type}</span>
//             </DialogTitle>
//           </DialogHeader>

//           {viewingDocument && (
//             <div className="flex-1 min-h-0 flex flex-col">
//               <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
//                 {(() => {
//                   const url = viewingDocument.file.url;
//                   const isPdf = url.endsWith(".pdf");
//                   const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);

//                   console.log("This is ", viewingDocument)
//                   if (isPdf) {
//                     return (
//                       <iframe
//                         src={url}
//                         className="w-full h-full min-h-[70vh] border-0"
//                         title={`Preview of ${viewingDocument.type}`}
//                         loading="lazy"
//                       />
//                     );
//                   } else if (isImage) {
//                     return (
//                       <div className="w-full h-full flex items-center justify-center p-4">
//                         <div className="relative w-full h-full max-h-[70vh]">
//                           <Image
//                             src={url}
//                             alt={`Preview of ${viewingDocument.type}`}
//                             fill
//                             className="object-contain"
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.src = "/placeholder.svg";
//                               target.alt = "Failed to load document preview";
//                               target.classList.add("opacity-50");
//                             }}
//                             unoptimized
//                           />
//                         </div>
//                       </div>
//                     );
//                   } else {
//                     return (
//                       <div className="flex items-center justify-center h-full text-muted-foreground p-4">
//                         Preview not available for this file type
//                       </div>
//                     );
//                   }
//                 })()}
//               </div>

//               {/* Document Details */}
//               <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm">
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <span className="font-medium">Uploaded by:</span>{" "}
//                     {viewingDocument.uploader.firstName}{" "}
//                     {viewingDocument.uploader.lastName}
//                   </div>
//                   <div>
//                     <span className="font-medium">Date:</span>{" "}
//                     {new Date(viewingDocument.createdAt).toLocaleDateString()}
//                   </div>
//                   <div className="col-span-2">
//                     <span className="font-medium">File Name:</span>{" "}
//                     {viewingDocument.file.url.split("/").pop()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Eye,
  Trash2,
  FileText,
  ImageIcon,
  File,
  Plus,
  UploadCloud,
  Download,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";

interface Document {
  _id: string;
  file: { url: string; public_id: string };
  uploader: { _id: string; firstName: string; lastName: string; email: string };
  type: string;
  createdAt: string;
}

interface DocumentMetadata {
  size?: number;
  contentType?: string;
  lastModified?: string;
  accessible: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ErrorResponse {
  message: string;
}

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

export function DocumentManager() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const uploaderId = session?.user?.id || "";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  // Fetch documents with TanStack Query
  const { 
    data: documentsResponse, 
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments 
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<ApiResponse<Document[]>> => {
      const res = await fetch(`${BASE_API}/document`);
      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({ 
          message: `Failed to fetch documents: ${res.status}` 
        }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch document metadata when viewing a document
  const { 
    data: documentMetadata,
    isLoading: isLoadingMetadata,
    error: metadataError 
  } = useQuery({
    queryKey: ["documentMetadata", viewingDocument?.file.url],
    queryFn: async (): Promise<DocumentMetadata> => {
      if (!viewingDocument?.file.url) {
        throw new Error("No document URL provided");
      }

      try {
        // Try to fetch document headers to check accessibility
        const response = await fetch(viewingDocument.file.url, { 
          method: 'HEAD',
          mode: 'cors'
        });
        
        return {
          size: response.headers.get('content-length') ? 
            parseInt(response.headers.get('content-length')!) : undefined,
          contentType: response.headers.get('content-type') || undefined,
          lastModified: response.headers.get('last-modified') || undefined,
          accessible: response.ok
        };
      } catch (error) {
        console.warn("Failed to fetch document metadata:", error);
        // Return minimal metadata if HEAD request fails
        return {
          accessible: true // Assume accessible, will handle in component
        };
      }
    },
    enabled: !!viewingDocument?.file.url,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });

  // Prefetch document metadata on hover
  const prefetchDocumentMetadata = (document: Document) => {
    queryClient.prefetchQuery({
      queryKey: ["documentMetadata", document.file.url],
      queryFn: async (): Promise<DocumentMetadata> => {
        try {
          const response = await fetch(document.file.url, { 
            method: 'HEAD',
            mode: 'cors'
          });
          
          return {
            size: response.headers.get('content-length') ? 
              parseInt(response.headers.get('content-length')!) : undefined,
            contentType: response.headers.get('content-type') || undefined,
            lastModified: response.headers.get('last-modified') || undefined,
            accessible: response.ok
          };
        } catch (error) {
          return { accessible: true };
        }
      },
      staleTime: 1000 * 60 * 10,
    });
  };

  // Upload mutation with better error handling
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${BASE_API}/document/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({ 
          message: `Upload failed: ${res.status} ${res.statusText}` 
        }));
        throw new Error(errorData.message);
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSelectedFile(null);
      setDocumentType("");
      toast.success("Document uploaded successfully");
      
      // Optionally prefetch the new document's metadata
      if (data?.data?.file?.url) {
        queryClient.prefetchQuery({
          queryKey: ["documentMetadata", data.data.file.url],
        });
      }
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      toast.error(error.message || "Upload failed");
    },
  });

  // Delete mutation with optimistic updates
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_API}/document/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({ 
          message: `Delete failed: ${res.status} ${res.statusText}` 
        }));
        throw new Error(errorData.message);
      }

      return res.json();
    },
    onMutate: async (deletingId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      
      // Snapshot the previous value
      const previousDocuments = queryClient.getQueryData(["documents"]);
      
      // Optimistically update to remove the document
      queryClient.setQueryData(["documents"], (old: any) => ({
        ...old,
        data: old?.data?.filter((doc: Document) => doc._id !== deletingId) || []
      }));
      
      return { previousDocuments };
    },
    onError: (error: Error, deletingId, context) => {
      // Rollback on error
      if (context?.previousDocuments) {
        queryClient.setQueryData(["documents"], context.previousDocuments);
      }
      console.error("Delete error:", error);
      toast.error(error.message || "Delete failed");
    },
    onSuccess: () => {
      toast.success("Document deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const handleFileSelect = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type))
      return toast.error("Only PDF, JPG, PNG files are allowed");
    if (file.size > 10 * 1024 * 1024)
      return toast.error("File size must be less than 10MB");
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return toast.error("Please select a file");
    if (!documentType) return toast.error("Please select a document type");
    if (!uploaderId) return toast.error("User not authenticated");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", documentType);
    formData.append("uploader", uploaderId);

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?"))
      deleteMutation.mutate(id);
  };

  const handleView = (doc: Document) => {
    setViewingDocument(doc);
    // Prefetch metadata when opening modal
    prefetchDocumentMetadata(doc);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith(".pdf")) return <FileText className="h-4 w-4" />;
    if (
      name.endsWith(".jpg") ||
      name.endsWith(".png") ||
      name.endsWith(".jpeg")
    )
      return <ImageIcon className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  const documents = documentsResponse?.data || [];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Business & License Documents</CardTitle>
          <CardDescription>
            Business registration and licensing documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleInputChange}
              className="hidden"
              id="file-upload"
            />
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 mb-2">
                <Plus className="h-6 w-6" />
              </div>
              <p className="text-sm">
                Browse and choose the files you want to upload from your computer
              </p>
              <UploadCloud className="mt-2" />
              <p className="text-base">Click to select a file</p>
              <p className="text-xs text-muted-foreground mt-2">
                Supported: PDF, JPG, PNG (Max 10MB)
              </p>
            </Label>
          </div>

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50 mt-4">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile.name)}
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Identity & Legal Documents">
                      Identity & Legal Documents
                    </SelectItem>
                    <SelectItem value="Business Registration">
                      Business Registration
                    </SelectItem>
                    <SelectItem value="License Documents">
                      License Documents
                    </SelectItem>
                    <SelectItem value="Financial Documents">
                      Financial Documents
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-primary text-white hover:bg-primary/80"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setDocumentType("");
                  }}
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Uploaded Documents */}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Uploaded Documents</span>
            {documentsError && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchDocuments()}
                className="text-xs"
              >
                Retry
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDocuments ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : documentsError ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive mb-2">Failed to load documents</p>
              <p className="text-sm text-muted-foreground mb-4">
                {documentsError.message}
              </p>
              <Button variant="outline" onClick={() => refetchDocuments()}>
                Try Again
              </Button>
            </div>
          ) : documents.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No documents uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  onMouseEnter={() => prefetchDocumentMetadata(doc)}
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.file.url)}
                    <div>
                      <p className="font-medium text-sm">{doc.type}</p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc._id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === doc._id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      <Dialog
        open={!!viewingDocument}
        onOpenChange={() => setViewingDocument(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewingDocument?.type}</span>
              <div className="flex items-center gap-2">
                {isLoadingMetadata && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument?.file.url) {
                      window.open(viewingDocument.file.url, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (viewingDocument?.file.url) {
                      const link = document.createElement('a');
                      link.href = viewingDocument.file.url;
                      link.download = viewingDocument.file.url.split('/').pop() || 'document';
                      link.click();
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {viewingDocument && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
                {(() => {
                  const url = viewingDocument.file.url;
                  const isPdf = url.toLowerCase().endsWith(".pdf");
                  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);

                  if (isPdf) {
                    return (
                      <div className="w-full h-full min-h-[70vh]">
                        <iframe
                          src={`${url}#toolbar=1&navpanes=1&scrollbar=1`}
                          className="w-full h-full border-0"
                          title={`Preview of ${viewingDocument.type}`}
                          loading="lazy"
                          onError={() => {
                            console.error("PDF iframe failed to load");
                          }}
                        />
                        
                        {/* Fallback for PDF */}
                        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center hidden">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <p className="text-lg font-medium mb-2">PDF Preview Unavailable</p>
                          <p className="text-muted-foreground mb-4">
                            Your browser or server settings prevent PDF preview
                          </p>
                          <div className="space-x-2">
                            <Button
                              onClick={() => window.open(url, '_blank')}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Open in New Tab
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isImage) {
                    return (
                      <div className="w-full h-full flex items-center justify-center p-4 min-h-[70vh]">
                        <div className="relative w-full h-full max-w-full max-h-full">
                          <Image
                            src={url}
                            alt={`Preview of ${viewingDocument.type}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                            onError={(e) => {
                              console.error("Image failed to load:", url);
                              const target = e.target as HTMLImageElement;
                              const container = target.parentElement;
                              if (container) {
                                container.innerHTML = `
                                  <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <div class="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                      <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <p class="text-lg font-medium mb-2">Image Preview Unavailable</p>
                                    <p class="text-center mb-4">Failed to load image. The file might be corrupted or access restricted.</p>
                                  </div>
                                `;
                              }
                            }}
                            unoptimized
                            priority
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 min-h-[70vh]">
                        <File className="h-16 w-16 mb-4" />
                        <p className="text-lg font-medium mb-2">Preview Not Available</p>
                        <p className="text-center mb-4">
                          Preview not supported for this file type: {url.split('.').pop()?.toUpperCase()}
                        </p>
                        <Button
                          onClick={() => window.open(url, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in New Tab
                        </Button>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Document Details with Metadata */}
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Uploaded by:</span>{" "}
                    {viewingDocument.uploader.firstName}{" "}
                    {viewingDocument.uploader.lastName}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(viewingDocument.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">File Name:</span>{" "}
                    {viewingDocument.file.url.split("/").pop()}
                  </div>
                  {documentMetadata?.size && (
                    <div>
                      <span className="font-medium">File Size:</span>{" "}
                      {formatFileSize(documentMetadata.size)}
                    </div>
                  )}
                  {documentMetadata?.contentType && (
                    <div className="col-span-2">
                      <span className="font-medium">Content Type:</span>{" "}
                      {documentMetadata.contentType}
                    </div>
                  )}
                  {metadataError && (
                    <div className="col-span-2 text-yellow-600">
                      <span className="font-medium">Note:</span> Could not fetch file metadata
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}