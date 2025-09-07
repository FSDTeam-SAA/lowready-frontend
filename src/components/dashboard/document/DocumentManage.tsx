"use client";

import { useEffect, useMemo, useState } from "react";
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
  // Trash2,
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
import { DeleteModal } from "./DeleteModal";

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

type DocumentMetadata = {
  size?: number;
  contentType?: string;
  lastModified?: string;
  accessible: boolean;
};

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

const isPdfUrl = (url: string): boolean => /\.pdf(\?|#|$)/i.test(url);
const isImageUrl = (url: string): boolean =>
  /\.(jpe?g|png|gif|webp|bmp|svg)(\?|#|$)/i.test(url);

const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

export function DocumentManager() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const uploaderId = session?.user?.id || "";

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);

  // Simple metadata state (no react-query complexity)
  const [metadata, setMetadata] = useState<DocumentMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // Fetch documents
  const {
    data: documentsResponse,
    isLoading: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async (): Promise<ApiResponse<Document[]>> => {
      const res = await fetch(`${BASE_API}/document`);
      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({
          message: `Failed to fetch documents: ${res.status}`,
        }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Upload
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${BASE_API}/document/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({
          message: `Upload failed: ${res.status} ${res.statusText}`,
        }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      setSelectedFile(null);
      setDocumentType("");
      toast.success("Document uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Upload failed");
    },
  });

  // Delete (optimistic)
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_API}/document/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData: ErrorResponse = await res.json().catch(() => ({
          message: `Delete failed: ${res.status} ${res.statusText}`,
        }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    onMutate: async (deletingId) => {
      await queryClient.cancelQueries({ queryKey: ["documents"] });
      const previous = queryClient.getQueryData<ApiResponse<Document[]>>([
        "documents",
      ]);
      queryClient.setQueryData<ApiResponse<Document[]>>(["documents"], (old) =>
        old
          ? { ...old, data: old.data.filter((d) => d._id !== deletingId) }
          : old
      );
      return { previous };
    },
    onError: (error, _id, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["documents"], ctx.previous);
      toast.error((error as Error).message || "Delete failed");
    },
    onSuccess: () => toast.success("Document deleted successfully"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["documents"] }),
  });

  const handleFileSelect = (file: File) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, JPG, PNG files are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
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
    if (confirm("Are you sure you want to delete this document?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (doc: Document) => {
    setViewingDocument(doc);
  };

  // Fetch metadata via simple HEAD when modal opens / url changes
  useEffect(() => {
    let aborted = false;
    const run = async () => {
      if (!viewingDocument?.file.url) {
        setMetadata(null);
        return;
      }
      setIsLoadingMetadata(true);
      try {
        const controller = new AbortController();
        const res = await fetch(viewingDocument.file.url, {
          method: "HEAD",
          mode: "cors",
          signal: controller.signal,
        });
        if (aborted) return;

        const sizeHeader = res.headers.get("content-length");
        const contentType = res.headers.get("content-type") || undefined;
        const lastModified = res.headers.get("last-modified") || undefined;

        setMetadata({
          size: sizeHeader ? Number.parseInt(sizeHeader) : undefined,
          contentType,
          lastModified,
          accessible: res.ok,
        });
      } catch {
        if (!aborted) {
          setMetadata({ accessible: true });
        }
      } finally {
        if (!aborted) setIsLoadingMetadata(false);
      }
    };
    run();
    return () => {
      aborted = true;
    };
  }, [viewingDocument?.file.url]);

  const documents = documentsResponse?.data ?? [];

  const currentUrl = viewingDocument?.file.url ?? "";
  const isPdf = useMemo(
    () => (currentUrl ? isPdfUrl(currentUrl) : false),
    [currentUrl]
  );
  const isImage = useMemo(
    () => (currentUrl ? isImageUrl(currentUrl) : false),
    [currentUrl]
  );

  const openInNewTab = () => {
    if (!currentUrl) return;
    window.open(currentUrl, "_blank", "noopener,noreferrer");
  };

  const downloadFile = () => {
    if (!currentUrl) return;
    const a = document.createElement("a");
    a.href = currentUrl;
    a.download = currentUrl.split("/").pop() || "document";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-5">
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
                Browse and choose the files you want to upload from your
                computer
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
                {isPdfUrl(selectedFile.name) ? (
                  <FileText className="h-4 w-4" />
                ) : isImageUrl(selectedFile.name) ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <File className="h-4 w-4" />
                )}
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
                      Identity &amp; Legal Documents
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
                {(documentsError as Error).message}
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
                >
                  <div className="flex items-center gap-3">
                    {isPdfUrl(doc.file.url) ? (
                      <FileText className="h-4 w-4" />
                    ) : isImageUrl(doc.file.url) ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <File className="h-4 w-4" />
                    )}
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
                    {/* <Button
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDocumentToDelete(doc);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>*/}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Preview Modal – simplified to mirror Admin behavior */}
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
                <Button variant="outline" size="sm" onClick={openInNewTab}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <Button variant="outline" size="sm" onClick={downloadFile}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {viewingDocument && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-auto border rounded-lg bg-muted/20">
                <div className="relative w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                  {isPdf ? (
                    <iframe
                      src={currentUrl}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  ) : isImage ? (
                    <Image
                      src={currentUrl}
                      alt={`Preview of ${viewingDocument.type}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      unoptimized
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                      <File className="h-16 w-16 mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        Preview Not Available
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This file type can’t be previewed here.
                      </p>
                      <Button
                        onClick={openInNewTab}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open in New Tab
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata (kept same styling) */}
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
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-medium">File Name:</span>{" "}
                    {currentUrl.split("/").pop()}
                  </div>
                  {typeof metadata?.size === "number" && (
                    <div>
                      <span className="font-medium">File Size:</span>{" "}
                      {formatFileSize(metadata.size)}
                    </div>
                  )}
                  {metadata?.contentType && (
                    <div className="col-span-2">
                      <span className="font-medium">Content Type:</span>{" "}
                      {metadata.contentType}
                    </div>
                  )}
                </div>
              </div>
              <DeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                documentName={documentToDelete?.type}
                onConfirm={() => {
                  if (documentToDelete) handleDelete(documentToDelete._id);
                  setDocumentToDelete(null);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
