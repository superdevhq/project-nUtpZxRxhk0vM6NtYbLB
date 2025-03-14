
import React from "react";
import FileUpload from "@/components/FileUpload";

const Index = () => {
  const handleFilesSelected = (files: File[]) => {
    console.log("Files selected:", files);
    // You'll implement Supabase storage integration here later
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10 mx-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">File Upload</h1>
            <p className="text-muted-foreground">
              Upload files with drag and drop support, progress tracking, and multi-file capabilities.
            </p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <FileUpload 
              maxFiles={5}
              maxSize={5}
              accept="image/*,.pdf,.docx"
              onFilesSelected={handleFilesSelected}
            />
          </div>

          <div className="p-4 text-sm border rounded-lg bg-muted/50">
            <h3 className="font-medium">Implementation Notes:</h3>
            <ul className="mt-2 ml-6 list-disc text-muted-foreground">
              <li>Drag and drop files into the upload area or click to browse</li>
              <li>Supports multiple file selection with progress indicators</li>
              <li>File size validation with customizable limits</li>
              <li>Currently using simulated upload progress</li>
              <li>Ready for Supabase storage integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
