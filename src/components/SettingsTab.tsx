
import React, { useState } from "react";
import { Trash2, Upload, Settings, Activity, Star, ChartPieIcon, ChartBarIcon, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsTabProps {
  selectedModel: string;
  modelPath: string;
  onSelectModel: (model: string) => void;
  onSetModelPath: (path: string) => void;
  onDeleteModel: () => void;
  temperature: number;
  setTemperature: (value: number) => void;
  maxTokens: number;
  setMaxTokens: (value: number) => void;
  appIcon: string;
  setAppIcon: (icon: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({
  selectedModel,
  modelPath,
  onSelectModel,
  onSetModelPath,
  onDeleteModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  appIcon,
  setAppIcon,
}) => {
  const [modelStatus, setModelStatus] = useState<"idle" | "running">("idle");
  
  const availableIcons = [
    { value: "📊", label: "Chart" },
    { value: "🤖", label: "Robot" },
    { value: "📚", label: "Books" },
    { value: "🧠", label: "Brain" },
    { value: "📈", label: "Graph" },
    { value: "🔍", label: "Magnifier" },
    { value: "💡", label: "Light Bulb" },
    { value: "🔮", label: "Crystal Ball" },
  ];

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
              <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                {selectedModel || modelPath || "No model selected"}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                modelStatus === "running" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}>
                {modelStatus === "running" ? "Running" : "Idle"}
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
                    // Use name instead of path since File API doesn't have direct path property
                    onSetModelPath(file.name);
                  }
                }}
                className="hidden"
                id="model-upload"
                accept=".gguf,.bin,.pth"
              />
              <Button asChild variant="outline" className="w-full">
                <label htmlFor="model-upload" className="cursor-pointer flex items-center justify-center w-full">
                  <Upload size={16} className="mr-2" />
                  Choose Model File
                </label>
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Temperature: {temperature.toFixed(1)}</Label>
            <Slider
              value={[temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={(values) => setTemperature(values[0])}
            />
          </div>

          <div>
            <Label className="mb-2 block">Max Tokens: {maxTokens}</Label>
            <Slider
              value={[maxTokens]}
              min={64}
              max={2048}
              step={64}
              onValueChange={(values) => setMaxTokens(values[0])}
            />
          </div>

          <div>
            <Label>App Icon</Label>
            <Select value={appIcon} onValueChange={setAppIcon}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select App Icon" />
              </SelectTrigger>
              <SelectContent>
                {availableIcons.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{icon.value}</span>
                      <span>{icon.label}</span>
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="random">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">🎲</span>
                    <span>Random on Startup</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data Visualization Settings</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <ChartPieIcon size={16} className="mr-2" />
                Pie Chart
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <ChartBarIcon size={16} className="mr-2" />
                Bar Chart
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <LineChart size={16} className="mr-2" />
                Line Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
