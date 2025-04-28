
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  modelPath: string;
  onSetModelPath: (path: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  modelPath,
  onSetModelPath,
}) => {
  const { toast } = useToast();
  const [isCustomPath, setIsCustomPath] = useState(false);

  const availableModels = [
    { id: "llama2-7b", name: "LLaMA 2 (7B)" },
    { id: "mistral-7b", name: "Mistral (7B)" },
    { id: "phi-2", name: "Phi-2" },
    { id: "ggml-gpt4all-j", name: "GPT4All-J" },
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

  return (
    <div className="space-y-2">
      <Select value={isCustomPath ? "custom" : selectedModel} onValueChange={handleModelSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select LLM model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom model path...</SelectItem>
        </SelectContent>
      </Select>

      {isCustomPath && (
        <div className="flex gap-2">
          <Input
            placeholder="Enter local model path"
            value={modelPath}
            onChange={(e) => onSetModelPath(e.target.value)}
          />
          <Button size="sm" onClick={handlePathSubmit}>Set</Button>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
