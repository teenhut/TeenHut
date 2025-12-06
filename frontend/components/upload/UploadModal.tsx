"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Select, 2: Details
  const [dragActive, setDragActive] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    formData.append("author", user?.username || "Anonymous");
    formData.append("userId", user?.id || "");

    try {
      const res = await fetch(`${API_BASE_URL}/api/hypes`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        onUploadSuccess();
        resetUpload();
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setStep(1);
    setUploadFile(null);
    setFilePreview(null);
    setUploadTitle("");
    setUploadDescription("");
    setIsUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white text-primary rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {step === 1 ? "Upload videos" : `${uploadTitle || "Draft"}`}
          </h2>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={resetUpload}
              className="text-gray-500 hover:text-primary hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0">
          {step === 1 ? (
            // Step 1: Drag and Drop
            <div
              className={`h-full flex flex-col items-center justify-center p-12 transition-colors ${
                dragActive ? "bg-gray-50" : "bg-white"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Upload className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Drag and drop video files to upload
              </h3>
              <p className="text-gray-500 text-sm mb-8">
                Your videos will be private until you publish them.
              </p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-sm uppercase text-sm"
              >
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleChange}
              />
            </div>
          ) : (
            // Step 2: Details
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left: Inputs */}
              <div className="flex-1 p-8 space-y-6 overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Details</h3>

                <div className="space-y-2">
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-primary transition-colors">
                    <label className="text-xs text-gray-500 block mb-1">
                      Title (required)
                    </label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-primary placeholder-gray-400"
                      placeholder="Add a title that describes your video"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:border-primary transition-colors h-40">
                    <label className="text-xs text-gray-500 block mb-1">
                      Description
                    </label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none text-primary placeholder-gray-400 resize-none"
                      placeholder="Tell viewers about your video"
                    />
                  </div>
                </div>
              </div>

              {/* Right: Preview */}
              <div className="w-full lg:w-1/3 bg-gray-50 p-6 border-l border-gray-200 flex flex-col">
                <div className="aspect-9/16 bg-black rounded-lg overflow-hidden mb-4 relative shadow-md">
                  {filePreview ? (
                    uploadFile?.type.startsWith("video") ? (
                      <video
                        src={filePreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Generating preview...
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Video Link</span>
                    <span className="text-blue-600 cursor-pointer">
                      https://teenhut.com/v/...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Filename</span>
                    <span className="truncate max-w-[150px]">
                      {uploadFile?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Checks complete. No issues found.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-primary hover:bg-gray-200"
              >
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !uploadTitle}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 rounded-sm uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Publish"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
