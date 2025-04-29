
/**
 * Utility for monitoring system resources during model loading and inference
 */

export interface SystemResources {
  memory: {
    used: number;
    total: number;
    usagePercent: number;
  };
  cpu: {
    usagePercent: number;
  };
  gpu?: {
    usagePercent: number;
    memoryUsed?: number;
    memoryTotal?: number;
  };
}

// Mock implementation for resource monitoring in the browser environment
// In a real app, this would connect to backend services that can access system metrics
export const getSystemResources = async (): Promise<SystemResources> => {
  try {
    // In a real implementation, this would make an API call to a backend
    // that can access system metrics. Here we're just simulating it.
    
    // We can use the Performance API to get some basic memory info if available
    let memoryInfo: any = {};
    if (performance && 'memory' in performance) {
      memoryInfo = (performance as any).memory;
    }
    
    // For demo/simulation purposes:
    const mockMemoryTotal = memoryInfo.jsHeapSizeLimit || 8000000000; // 8GB if not available
    const mockMemoryUsed = memoryInfo.usedJSHeapSize || Math.random() * 4000000000; // Random value if not available
    
    // Return mock data structure
    return {
      memory: {
        used: mockMemoryUsed,
        total: mockMemoryTotal,
        usagePercent: (mockMemoryUsed / mockMemoryTotal) * 100
      },
      cpu: {
        usagePercent: 25 + Math.random() * 60 // Random value between 25-85%
      },
      gpu: navigator.gpu ? {
        usagePercent: 30 + Math.random() * 50, // Random value between 30-80%
        memoryUsed: 2 + Math.random() * 6, // Random value between 2-8 GB
        memoryTotal: 12 // Assuming 12GB VRAM
      } : undefined
    };
  } catch (error) {
    console.error("Error getting system resources:", error);
    return {
      memory: { used: 0, total: 1, usagePercent: 0 },
      cpu: { usagePercent: 0 }
    };
  }
};

// For production use, we'd implement an actual API call to the backend
export const getResourcesFromBackend = async (): Promise<SystemResources> => {
  try {
    const response = await fetch('/api/system-resources');
    if (!response.ok) {
      throw new Error('Failed to fetch system resources');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching system resources:", error);
    return await getSystemResources(); // Fall back to mock implementation
  }
};

// Helper to format memory sizes for display
export const formatMemory = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = -1;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return value.toFixed(2) + ' ' + units[unitIndex];
};
