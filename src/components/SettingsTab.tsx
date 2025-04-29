import React, { useState } from "react";
import { Trash2, Upload, Settings, ChartPie, BarChart, LineChart, HardDrive, Cpu, Database, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SystemResourceMonitor from "./SystemResourceMonitor";

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
  const [isModelLoading, setIsModelLoading] = useState(false);
  
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

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState("quantized"); 
  const [contextSize, setContextSize] = useState(4096);

  return (
    <div className="p-4 space-y-4 overflow-auto max-h-[calc(100vh-4rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className="flex-1 text-sm text-muted-foreground">
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
                      setIsModelLoading(true);
                      setTimeout(() => setIsModelLoading(false), 3000);
                    }
                  }}
                  className="hidden"
                  id="model-upload"
                  accept=".gguf,.bin,.pth,.onnx"
                />
                <Button asChild variant="outline" className="w-full" disabled={isModelLoading}>
                  <label htmlFor="model-upload" className="cursor-pointer flex items-center justify-center w-full">
                    {isModelLoading ? (
                      <>Loading model...</>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Choose Model File
                      </>
                    )}
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
              <div className="flex justify-between items-center">
                <Label>Advanced Settings</Label>
                <Switch checked={showAdvancedSettings} onCheckedChange={setShowAdvancedSettings} />
              </div>
              
              {showAdvancedSettings && (
                <div className="space-y-3 mt-3 border border-border rounded-md p-3">
                  <div>
                    <Label className="text-sm mb-1 block">Model Type</Label>
                    <Select value={selectedModelType} onValueChange={setSelectedModelType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quantized">GGUF Quantized</SelectItem>
                        <SelectItem value="full">Full Precision</SelectItem>
                        <SelectItem value="onnx">ONNX Runtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-1 block">Context Size: {contextSize}</Label>
                    <Slider
                      value={[contextSize]}
                      min={1024}
                      max={32768}
                      step={1024}
                      onValueChange={(values) => setContextSize(values[0])}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>1K</span>
                      <span>32K</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs mb-1 block">Threads</Label>
                      <Input type="number" min={1} max={32} defaultValue={4} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Batch Size</Label>
                      <Input type="number" min={1} max={8} defaultValue={1} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <SystemResourceMonitor isModelLoading={isModelLoading} isModelInference={modelStatus === "running"} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">App Icon</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={appIcon} onValueChange={setAppIcon}>
                <SelectTrigger className="mt-1">
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Data Visualization Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" className="flex items-center justify-center">
                  <ChartPie size={16} className="mr-2" />
                  Pie Chart
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-center">
                  <BarChart size={16} className="mr-2" />
                  Bar Chart
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-center">
                  <LineChart size={16} className="mr-2" />
                  Line Chart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;

// Add a missing Input component to avoid TypeScript errors
const Input = ({ ...props }) => {
  return <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
};
