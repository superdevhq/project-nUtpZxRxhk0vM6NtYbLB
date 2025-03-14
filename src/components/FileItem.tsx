
import React from "react";
import { File, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { FileWithStatus } from "./FileUpload";

interface FileItemProps {
  fileWithStatus: FileWithStatus;
  onRemove: () => void;
}

const FileItem = ({ fileWithStatus, onRemove }: FileItemProps) => {
  const { file, progress, status, error } = fileWithStatus;

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = () => {
    const fileType = file.type.split("/")[0];
    
    return <File className="w-5 h-5" />;
  };

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-md border p-2 transition-colors",
        status === "error" && "border-destructive/50 bg-destructive/10"
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted">
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{file.name}</p>
          {getStatusIcon()}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          {error && <span className="text-destructive">{error}</span>}
        </div>
        
        {status === "uploading" && (
          <Progress 
            value={progress} 
            className="h-1 mt-1" 
          />
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Remove file</span>
      </Button>
    </div>
  );
};

export default FileItem;
