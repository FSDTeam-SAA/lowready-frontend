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
import { Eye, Trash2, FileText, ImageIcon, File, Plus, UploadCloud } from "lucide-react";
// import { cn } from "@/lib/utils";
import Image from "next/image";

interface Document {
  _id: string;
  file: { url: string; public_id: string };
  uploader: { _id: string; firstName: string; lastName: string; email: string };
  type: string;
  createdAt: string;
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

  // Fetch documents
  const { data: documentsResponse, isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<ApiResponse<Document[]>> => {
      const res = await fetch(`${BASE_API}/document`); // Changed from /document/ to /document
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  // Upload mutation - Fixed endpoint and error handling
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const res = await fetch(`${BASE_API}/document/upload`, {
          // Changed endpoint
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData: ErrorResponse = await res
            .json()
            .catch(() => ({ message: "Upload failed" }));
          console.log(errorData);
          throw new Error(
            errorData.message || `Upload failed with status ${res.status}`
          );
        }

        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Unknown upload error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSelectedFile(null);
      setDocumentType("");
      toast.success("Document uploaded successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Upload failed"),
  });

  // Delete mutation - Fixed endpoint and error handling
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await fetch(`${BASE_API}/document/${id}`, {
          // Changed endpoint
          method: "DELETE",
        });

        if (!res.ok) {
          const errorData: ErrorResponse = await res
            .json()
            .catch(() => ({ message: "Delete failed" }));
          throw new Error(
            errorData.message || `Delete failed with status ${res.status}`
          );
        }

        return res.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Unknown delete error occurred");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document deleted successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
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

  const handleView = (doc: Document) => setViewingDocument(doc);

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
              <p className="tex-sm">Browse and chose the files you want to upload from your computer</p>
              <UploadCloud />
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
                  {uploadMutation.isPending ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setDocumentType("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        {/* Uploaded Documents */}

        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">
              Loading documents...
            </p>
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
                      <Trash2 className="h-4 w-4 text-destructive" />
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
        
      </DialogTitle>
    </DialogHeader>

    {viewingDocument && (
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
          {viewingDocument.file.url.endsWith(".pdf") ? (
            // PDF Viewer
            <iframe
              src={viewingDocument.file.url}
              className="w-full h-full min-h-[70vh] border-0"
              title={`Preview of ${viewingDocument.type}`}
              loading="lazy"
            />
          ) : (
            // Image Viewer
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="relative w-full h-full max-h-[70vh]">
                <Image
                  src={viewingDocument.file.url}
                  alt={`Preview of ${viewingDocument.type}`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                    target.alt = "Failed to load document preview";
                    target.classList.add("opacity-50");
                  }}
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>

        {/* Document Details */}
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
            <div className="col-span-2">
              <span className="font-medium">File Name:</span>{" "}
              {viewingDocument.file.url.split("/").pop()}
            </div>
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

    </div>
  );
}
