
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { HardDrive, Upload, Database, Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  modelPath: string;
  onSetModelPath: (path: string) => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  modelPath,
  onSetModelPath,
  isLoading = false,
  setIsLoading
}) => {
  const { toast } = useToast();
  const [isCustomPath, setIsCustomPath] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableModels = [
    { id: "llama2-7b", name: "LLaMA 2 (7B)" },
    { id: "mistral-7b", name: "Mistral (7B)" },
    { id: "phi-2", name: "Phi-2" },
    { id: "ggml-gpt4all-j", name: "GPT4All-J" },
    { id: "gemma-2b", name: "Gemma (2B)" },
  ];

  const handleModelSelect = (value: string) => {
    if (value === "custom") {
      setIsCustomPath(true);
      onSelectModel("");
    } else {
      setIsCustomPath(false);
      onSelectModel(value);
      onSetModelPath("");

      toast({
        title: "Model selected",
        description: `Selected: ${availableModels.find(m => m.id === value)?.name || value}`,
      });
    }
  };

  const handlePathSubmit = () => {
    if (!modelPath.trim()) {
      toast({
        title: "Invalid path",
        description: "Please enter a valid model path.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Custom model path set",
      description: modelPath,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (setIsLoading) setIsLoading(true);
    
    // Check file size (show warning for large files)
    if (file.size > 1000000000) { // 1GB
      toast({
        title: "Large model file",
        description: `This file is ${(file.size / 1000000000).toFixed(2)}GB. Loading may take some time.`,
        variant: "destructive", // Changed from "warning" to "destructive" as "warning" is not a valid variant
      });
    }
    
    // Simulate file upload progress for demo purposes
    // In a real app, this would track actual file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Simulate model loading completion
        setTimeout(() => {
          onSetModelPath(file.name);
          setIsCustomPath(true);
          if (setIsLoading) setIsLoading(false);
          setUploadProgress(0);
          
          toast({
            title: "Model loaded successfully",
            description: `${file.name} is ready to use.`,
          });
        }, 1000);
      }
      setUploadProgress(progress);
    }, 500);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Select
        value={isCustomPath ? "custom" : selectedModel}
        onValueChange={handleModelSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select LLM model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                <Database size={14} />
                {model.name}
              </div>
            </SelectItem>
          ))}
          <SelectItem value="custom">
            <div className="flex items-center gap-2">
              <HardDrive size={14} />
              Custom model...
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {isCustomPath && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter local model path"
            value={modelPath}
            onChange={(e) => onSetModelPath(e.target.value)}
            disabled={isLoading}
          />
          <Button size="sm" onClick={handlePathSubmit} disabled={isLoading}>Set</Button>
        </div>
      )}
      
      <div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".bin,.gguf,.ggml,.pt,.pth,.safetensors,.onnx"
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={triggerFileUpload}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={14} className="mr-2 animate-spin" />
              Loading model...
            </>
          ) : (
            <>
              <Upload size={14} className="mr-2" />
              Upload model file
            </>
          )}
        </Button>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="h-1" />
            <div className="text-xs text-right mt-0.5 text-muted-foreground">
              {Math.round(uploadProgress)}%
            </div>
          </div>
        )}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        Supported formats: .bin, .gguf, .ggml, .pt, .onnx
      </div>
    </div>
  );
};

export default ModelSelector;
