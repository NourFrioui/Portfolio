"use client";

import React, { useState, useRef } from "react";
import {
  DocumentArrowDownIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface PdfUploadProps {
  currentPdf?: string;
  onPdfUpload: (pdfUrl: string) => void;
  label?: string;
  className?: string;
  userId?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const PdfUpload: React.FC<PdfUploadProps> = ({
  currentPdf,
  onPdfUpload,
  label = "Upload CV/Resume",
  className = "",
  userId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(currentPdf || null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }

    // Validate file size (10MB max for PDFs)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setFileName(file.name);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (userId) {
        formData.append("userId", userId);
      }

      const endpoint = "/upload/pdf";
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setPdfUrl(result.url);
      onPdfUpload(result.url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload PDF. Please try again.");
      setPdfUrl(currentPdf || null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePdf = () => {
    setPdfUrl(null);
    setFileName("");
    onPdfUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className="flex items-center space-x-4">
        {/* PDF Preview */}
        <div className="relative">
          {pdfUrl ? (
            <div className="relative group">
              <div className="w-24 h-24 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-12 h-12 text-red-600" />
              </div>
              <button
                type="button"
                onClick={handleRemovePdf}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove PDF"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <DocumentIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="space-y-2">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="-ml-1 mr-2 h-4 w-4" />
                    Choose PDF
                  </>
                )}
              </button>

              {pdfUrl && (
                <>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <DocumentArrowDownIcon className="-ml-1 mr-2 h-4 w-4" />
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={handleRemovePdf}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
                    Remove
                  </button>
                </>
              )}
            </div>

            {fileName && (
              <p className="text-sm text-gray-600 truncate">
                <strong>File:</strong> {fileName}
              </p>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500">PDF files up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
