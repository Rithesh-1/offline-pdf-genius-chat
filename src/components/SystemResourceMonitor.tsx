
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSystemResources, formatMemory, SystemResources } from '@/utils/systemMonitor';
import { Cpu, HardDrive, Database, Server } from 'lucide-react';

interface SystemResourceMonitorProps {
  isModelLoading: boolean;
  isModelInference: boolean;
  className?: string;
}

const SystemResourceMonitor: React.FC<SystemResourceMonitorProps> = ({
  isModelLoading,
  isModelInference,
  className = ""
}) => {
  const [resources, setResources] = useState<SystemResources | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  // Start/stop resource polling based on model activity
  useEffect(() => {
    const shouldPoll = isModelLoading || isModelInference;
    setIsPolling(shouldPoll);
  }, [isModelLoading, isModelInference]);

  // Poll for resource updates when needed
  useEffect(() => {
    if (!isPolling) return;

    // Initial fetch
    getSystemResources().then(setResources);
    
    // Set up polling interval (every 2 seconds)
    const intervalId = setInterval(() => {
      getSystemResources().then(setResources);
    }, 2000);
    
    // Clean up on unmount or when polling stops
    return () => clearInterval(intervalId);
  }, [isPolling]);

  if (!resources) return null;

  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Server size={16} />
          System Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <HardDrive size={14} />
              <span>Memory</span>
            </div>
            <span>{formatMemory(resources.memory.used)} / {formatMemory(resources.memory.total)}</span>
          </div>
          <Progress value={resources.memory.usagePercent} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <div className="flex items-center gap-1">
              <Cpu size={14} />
              <span>CPU</span>
            </div>
            <span>{Math.round(resources.cpu.usagePercent)}%</span>
          </div>
          <Progress value={resources.cpu.usagePercent} className="h-2" />
        </div>
        
        {resources.gpu && (
          <div>
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-1">
                <Database size={14} />
                <span>GPU</span>
              </div>
              <span>{Math.round(resources.gpu.usagePercent)}%</span>
            </div>
            <Progress value={resources.gpu.usagePercent} className="h-2" />
            {resources.gpu.memoryUsed && resources.gpu.memoryTotal && (
              <div className="text-xs mt-1 text-right">
                VRAM: {resources.gpu.memoryUsed.toFixed(1)}GB / {resources.gpu.memoryTotal}GB
              </div>
            )}
          </div>
        )}
        
        {(isModelLoading || isModelInference) && (
          <div className="text-xs text-muted-foreground mt-1">
            {isModelLoading ? 'Loading model...' : 'Running inference...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemResourceMonitor;
