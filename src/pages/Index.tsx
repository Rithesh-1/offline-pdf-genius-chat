import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, FileUp, Cog, Trash2, FileText, User, Server } from "lucide-react";

import PDFUploader from "@/components/PDFUploader";
import ModelSelector from "@/components/ModelSelector";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import PDFComparison from "@/components/PDFComparison";
import { PDFDocument } from "@/types/pdf";
import ThemeSelector from "@/components/ThemeSelector";
import SettingsTab from "@/components/SettingsTab";
import DataVisualization from "@/components/DataVisualization";
import AppIconSelector from "@/components/AppIconSelector";
import PythonBackend from "@/services/PythonBackend";
import SystemResourceMonitor from "@/components/SystemResourceMonitor";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [messages, setMessages] = useState<Array<{ role: string; content: string; data?: any[] }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelPath, setModelPath] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(512);
  const [mode, setMode] = useState<"single" | "compare">("single");
  const [appIcon, setAppIcon] = useState<string>("random");
  const [visualizationData, setVisualizationData] = useState<any[] | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelRunning, setIsModelRunning] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Theme state
  const [theme, setTheme] = useState<string>(() => {
    // Check for saved theme or system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Helper function for PDF file checking
  const isPDFUploaded = () => {
    return documents.length > 0;
  };

  // Helper function for model checking
  const isModelSelected = () => {
    return !!selectedModel || !!modelPath;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Enforce PDF upload requirement
    if (!isPDFUploaded()) {
      toast({
        title: "No PDF document",
        description: "You must upload at least one PDF document before chatting.",
        variant: "destructive",
      });
      return;
    }

    // Enforce model selection requirement
    if (!isModelSelected()) {
      toast({
        title: "No model selected",
        description: "Please select a model or provide a path to a model file.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue("");
    
    // Show model running status during inference
    setIsModelRunning(true);

    try {
      // Check if the message contains visualization requests
      const isVisualizationRequest = 
        inputValue.toLowerCase().includes('chart') || 
        inputValue.toLowerCase().includes('graph') || 
        inputValue.toLowerCase().includes('plot') ||
        inputValue.toLowerCase().includes('visualize');
      
      if (isVisualizationRequest) {
        // Process data visualization request
        const response = await PythonBackend.analyzeData({
          query: inputValue,
          documents: documents.map(doc => doc.name),
          analysisType: 'visualization'
        });
        
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: response.result,
          data: response.data 
        }]);
        
        if (response.data) {
          setVisualizationData(response.data);
          setTimeout(() => {
            setActiveTab("visualization");
          }, 500);
        }
      } else {
        // Process regular query
        setTimeout(() => {
          const simulatedResponse = {
            role: "assistant",
            content: `This is a simulated response to: "${inputValue}"\n\nIn a real implementation, this would process your query using the selected LLM model (${selectedModel || modelPath}) against the uploaded PDF documents (${documents.map(d => d.name).join(", ")}).`,
          };
          setMessages((prev) => [...prev, simulatedResponse]);
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Error processing request",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsModelRunning(false);
    }
  };

  const handleFileUpload = (newDocuments: PDFDocument[]) => {
    setDocuments((prev) => [...prev, ...newDocuments]);
    toast({
      title: `${newDocuments.length} PDF${newDocuments.length > 1 ? 's' : ''} uploaded`,
      description: "Documents are ready for analysis.",
    });

    if (messages.length === 0) {
      setMessages([{ 
        role: "assistant", 
        content: "I've processed your PDF documents. You can now ask me questions about their content!" 
      }]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been cleared.",
    });
  };

  const clearDocuments = () => {
    setDocuments([]);
    setMessages([]);
    toast({
      title: "Documents cleared",
      description: "All uploaded documents have been removed.",
    });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleDeleteModel = () => {
    setSelectedModel("");
    setModelPath("");
    toast({
      title: "Model removed",
      description: "The model has been successfully removed.",
    });
  };

  // Show warning when trying to chat without PDFs
  const handleChatFocus = () => {
    if (!isPDFUploaded()) {
      toast({
        title: "Upload a PDF first",
        description: "Please upload at least one PDF document before starting the chat.",
        variant: "destructive",
      });
    } else if (!isModelSelected()) {
      toast({
        title: "Select a model",
        description: "Please select or load a model to analyze your documents.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
          <div className="flex items-center justify-center w-8 h-8">
            <AppIconSelector icon={appIcon} size="sm" />
          </div>
          <span>PDF Genius</span>
          {documents.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({documents.length} PDF{documents.length !== 1 && 's'})
            </span>
          )}
        </h2>
        
        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-sm font-medium mb-2 text-foreground">Upload PDFs</h3>
            <PDFUploader onUpload={handleFileUpload} />
          </div>

          <div className="h-px bg-border" />
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-foreground">Model Settings</h3>
            <ModelSelector 
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              modelPath={modelPath}
              onSetModelPath={setModelPath}
              isLoading={isModelLoading}
              setIsLoading={setIsModelLoading}
            />
            
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Temperature</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))} 
                  className="w-full"
                />
                <span className="text-sm w-8 text-foreground">{temperature}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Max Tokens</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range"
                  min={64}
                  max={2048}
                  step={64}
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))} 
                  className="w-full"
                />
                <span className="text-sm w-12 text-foreground">{maxTokens}</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />
          
          <div>
            <h3 className="text-sm font-medium mb-2 text-foreground">Analysis Mode</h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer text-foreground">
                <input 
                  type="radio" 
                  checked={mode === "single"} 
                  onChange={() => setMode("single")} 
                  className="form-radio text-primary"
                />
                <span>Analyze Single PDF</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer text-foreground">
                <input 
                  type="radio" 
                  checked={mode === "compare"} 
                  onChange={() => setMode("compare")} 
                  className="form-radio text-primary"
                />
                <span>Compare PDFs</span>
              </label>
            </div>
          </div>
          
          {(isModelLoading || isModelRunning) && (
            <div className="mt-2">
              <SystemResourceMonitor 
                isModelLoading={isModelLoading} 
                isModelInference={isModelRunning} 
              />
            </div>
          )}
        </div>

        {documents.length > 0 && (
          <>
            <div className="h-px bg-border my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2 text-foreground">Uploaded Documents ({documents.length})</h3>
              <div className="h-40 overflow-y-auto pr-2">
                <ul className="space-y-1">
                  {documents.map((doc, index) => (
                    <li key={index} className="text-sm flex items-center gap-2 text-foreground">
                      <FileText size={14} />
                      <span className="truncate">{doc.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearDocuments} 
                className="mt-2 w-full"
              >
                <Trash2 size={14} className="mr-1" /> Clear Documents
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border p-4 flex justify-between items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageCircle size={16} />
                Chat
              </TabsTrigger>
              {mode === "compare" && documents.length >= 2 && (
                <TabsTrigger value="compare" className="flex items-center gap-1">
                  <FileUp size={16} />
                  Compare Documents
                </TabsTrigger>
              )}
              {visualizationData && (
                <TabsTrigger value="visualization" className="flex items-center gap-1">
                  <FileText size={16} />
                  Visualization
                </TabsTrigger>
              )}
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Cog size={16} />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <Trash2 size={16} className="mr-1" /> Clear Chat
            </Button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 flex flex-col ${activeTab === "chat" ? "" : "hidden"}`}>
            <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 bg-muted/30">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                  <AppIconSelector icon={appIcon} size="lg" />
                  <p className="mt-2 text-center max-w-md">
                    {!isPDFUploaded() ? (
                      <>Upload PDFs to start chatting about your documents.</>
                    ) : !isModelSelected() ? (
                      <>Select a model to analyze your PDF documents.</>
                    ) : (
                      <>Your documents and model are ready. Type a message to start chatting.</>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <div className="bg-card rounded-lg p-4 shadow-sm animate-pulse w-16 h-8"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <ChatInput 
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
              disabled={!isPDFUploaded() || !isModelSelected()}
            />
          </div>
          
          <div className={`flex-1 p-4 bg-muted/30 overflow-auto ${activeTab === "compare" ? "" : "hidden"}`}>
            {mode === "compare" && documents.length >= 2 ? (
              <PDFComparison documents={documents} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>Please select at least two documents to compare.</p>
              </div>
            )}
          </div>

          <div className={`flex-1 p-4 bg-muted/30 overflow-auto ${activeTab === "visualization" ? "" : "hidden"}`}>
            {visualizationData ? (
              <DataVisualization data={visualizationData} title="Document Analysis" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <p>Ask a question about charts or visualization to see data analysis.</p>
              </div>
            )}
          </div>

          <div className={`flex-1 ${activeTab === "settings" ? "" : "hidden"}`}>
            <SettingsTab
              selectedModel={selectedModel}
              modelPath={modelPath}
              onSelectModel={setSelectedModel}
              onSetModelPath={setModelPath}
              onDeleteModel={handleDeleteModel}
              temperature={temperature}
              setTemperature={setTemperature}
              maxTokens={maxTokens}
              setMaxTokens={setMaxTokens}
              appIcon={appIcon}
              setAppIcon={setAppIcon}
            />
          </div>
        </div>
      </div>
      
      <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
};

export default Index;
