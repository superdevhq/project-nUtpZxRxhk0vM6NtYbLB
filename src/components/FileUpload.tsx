
import React, { useState, useRef, useCallback } from "react";
import { Cloud, File, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FileItem from "./FileItem";

export type FileStatus = "uploading" | "success" | "error" | "idle";

export interface FileWithStatus {
  file: File;
  id: string;
  progress: number;
  status: FileStatus;
  error?: string;
}

interface FileUploadProps {
  className?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  onFilesSelected?: (files: File[]) => void;
}

const FileUpload = ({
  className,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  accept = "*",
  onFilesSelected,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      // Convert FileList to array and filter if needed
      const newFiles = Array.from(selectedFiles)
        .filter((file) => {
          // Check file size (convert maxSize from MB to bytes)
          if (file.size > maxSize * 1024 * 1024) {
            console.warn(`File ${file.name} exceeds the maximum size limit`);
            return false;
          }
          return true;
        })
        .slice(0, maxFiles - files.length)
        .map((file) => ({
          file,
          id: crypto.randomUUID(),
          progress: 0,
          status: "idle" as FileStatus,
        }));

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles]);
        if (onFilesSelected) {
          onFilesSelected(newFiles.map((f) => f.file));
        }

        // Simulate upload progress for demo purposes
        newFiles.forEach((fileWithStatus) => {
          simulateUpload(fileWithStatus.id);
        });
      }
    },
    [files.length, maxFiles, maxSize, onFilesSelected]
  );

  // Simulate file upload progress
  const simulateUpload = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 300);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const browseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-8 transition-colors border-2 border-dashed rounded-lg cursor-pointer group hover:bg-muted/30",
          isDragging ? "border-primary bg-muted/40" : "border-muted-foreground/25",
          files.length >= maxFiles ? "opacity-50 pointer-events-none" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={browseFiles}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-4 bg-muted rounded-full">
            <Cloud className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </h3>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
          </div>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {maxSize}MB each
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium">
            {files.length} {files.length === 1 ? "file" : "files"} selected
          </div>

          <div className="space-y-2">
            {files.map((fileWithStatus) => (
              <FileItem
                key={fileWithStatus.id}
                fileWithStatus={fileWithStatus}
                onRemove={() => removeFile(fileWithStatus.id)}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiles([])}
              type="button"
            >
              Clear All
            </Button>
            <Button size="sm" type="button">
              Upload {files.length} {files.length === 1 ? "file" : "files"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
