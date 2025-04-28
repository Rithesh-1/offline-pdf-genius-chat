
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "@/types/pdf";

interface PDFUploaderProps {
  onUpload: (documents: PDFDocument[]) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newDocuments: PDFDocument[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "application/pdf") {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a PDF file.`,
            variant: "destructive",
          });
          continue;
        }

        // In a real implementation, this would process the PDF content
        // Here we're just simulating it by creating a document object
        const doc: PDFDocument = {
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          content: "This is simulated PDF content. In a real implementation, this would contain the extracted text from the PDF.",
          pages: Math.floor(Math.random() * 20) + 1, // Random page count for simulation
        };

        newDocuments.push(doc);
      }

      if (newDocuments.length > 0) {
        onUpload(newDocuments);
      }
    } catch (error) {
      toast({
        title: "Error uploading PDF",
        description: "An error occurred while processing the PDF files.",
        variant: "destructive",
      });
      console.error("PDF upload error:", error);
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      event.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="pdf-upload" className="cursor-pointer">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
          <Upload size={24} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 text-center">
            {isUploading ? "Uploading..." : "Click to upload PDFs"}
          </span>
        </div>
        <input
          id="pdf-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default PDFUploader;
