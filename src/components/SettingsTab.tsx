
import React from "react";
import { Trash2, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface SettingsTabProps {
  selectedModel: string;
  modelPath: string;
  onSelectModel: (model: string) => void;
  onSetModelPath: (path: string) => void;
  onDeleteModel: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  selectedModel,
  modelPath,
  onSelectModel,
  onSetModelPath,
  onDeleteModel,
}) => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Model Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Selected Model</Label>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex-1 text-sm text-gray-600">
                {selectedModel || modelPath || "No model selected"}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteModel}
                disabled={!selectedModel && !modelPath}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Model
              </Button>
            </div>
          </div>
          <div>
            <Label>Upload New Model</Label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onSetModelPath(file.path);
                  }
                }}
                className="hidden"
                id="model-upload"
                accept=".gguf,.bin,.pth"
              />
              <Button asChild variant="outline" className="w-full">
                <label htmlFor="model-upload" className="cursor-pointer">
                  <Upload size={16} className="mr-2" />
                  Choose Model File
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;

