
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, FileUp, Cog, Send, Trash2, Download, FileText, Bot, User } from "lucide-react";

import PDFUploader from "@/components/PDFUploader";
import ModelSelector from "@/components/ModelSelector";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import PDFComparison from "@/components/PDFComparison";
import { PDFDocument } from "@/types/pdf";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [modelPath, setModelPath] = useState<string>("");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(512);
  const [mode, setMode] = useState<"single" | "compare">("single");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (documents.length === 0) {
      toast({
        title: "No PDF document",
        description: "Please upload at least one PDF document first.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedModel && !modelPath) {
      toast({
        title: "No LLM model selected",
        description: "Please select or provide a path to an LLM model.",
        variant: "destructive",
      });
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setIsLoading(true);

    // Simulate LLM processing
    setTimeout(() => {
      // This is a simulation. In a real implementation, this would call the backend API
      const simulatedResponse = {
        role: "assistant",
        content: `This is a simulated response to: "${inputValue}"\n\nIn a real implementation, this would process your query using the selected LLM model (${selectedModel || modelPath}) against the uploaded PDF documents (${documents.map(d => d.name).join(", ")}).`,
      };
      setMessages((prev) => [...prev, simulatedResponse]);
      setIsLoading(false);
    }, 1500);

    setInputValue("");
  };

  const handleFileUpload = (newDocuments: PDFDocument[]) => {
    setDocuments((prev) => [...prev, ...newDocuments]);
    toast({
      title: `${newDocuments.length} PDF${newDocuments.length > 1 ? 's' : ''} uploaded`,
      description: "Documents are ready for analysis.",
    });

    // If this is the first document, add a welcome message
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Bot size={24} />
          <span>PDF Genius</span>
        </h2>
        
        <div className="space-y-6 flex-1">
          <div>
            <h3 className="text-sm font-medium mb-2">Upload PDFs</h3>
            <PDFUploader onUpload={handleFileUpload} />
          </div>

          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Model Settings</h3>
            <ModelSelector 
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              modelPath={modelPath}
              onSetModelPath={setModelPath}
            />
            
            <div className="mt-4">
              <label className="text-sm font-medium">Temperature</label>
              <div className="flex items-center gap-2">
                <Slider 
                  value={[temperature]} 
                  min={0} 
                  max={1} 
                  step={0.1}
                  onValueChange={(values) => setTemperature(values[0])} 
                />
                <span className="text-sm w-8">{temperature}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium">Max Tokens</label>
              <div className="flex items-center gap-2">
                <Slider 
                  value={[maxTokens]} 
                  min={64} 
                  max={2048} 
                  step={64}
                  onValueChange={(values) => setMaxTokens(values[0])} 
                />
                <span className="text-sm w-12">{maxTokens}</span>
              </div>
            </div>
          </div>

          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Analysis Mode</h3>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={mode === "single"} 
                  onChange={() => setMode("single")} 
                  className="form-radio text-blue-600"
                />
                <span>Analyze Single PDF</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={mode === "compare"} 
                  onChange={() => setMode("compare")} 
                  className="form-radio text-blue-600"
                />
                <span>Compare PDFs</span>
              </label>
            </div>
          </div>
        </div>

        {/* Document List */}
        {documents.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Uploaded Documents ({documents.length})</h3>
              <ScrollArea className="h-40">
                <ul className="space-y-1">
                  {documents.map((doc, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <FileText size={14} />
                      <span className="truncate">{doc.name}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
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
            </TabsList>
          
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              {/* Chat content will be rendered here */}
            </TabsContent>
            
            <TabsContent value="compare" className="flex-1 p-0 m-0 bg-gray-50">
              {/* Compare content will be rendered here */}
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <Trash2 size={16} className="mr-1" /> Clear Chat
            </Button>
          </div>
        </div>
        
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Bot size={48} strokeWidth={1} />
                  <p className="mt-2 text-center max-w-md">
                    Upload PDFs and select a model to start chatting about your documents.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm animate-pulse w-16 h-8"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <ChatInput 
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
              disabled={documents.length === 0 || (!selectedModel && !modelPath)}
            />
          </div>
        )}
        
        {activeTab === "compare" && (
          <div className="flex-1 p-4 bg-gray-50 overflow-auto">
            {mode === "compare" && documents.length >= 2 ? (
              <PDFComparison documents={documents} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Please select at least two documents to compare.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
