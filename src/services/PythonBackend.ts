
// This is a mock service that simulates Python backend integration
// In a real application, this would make API calls to a Python backend

export interface AnalysisRequest {
  query: string;
  documents: string[];
  analysisType: 'summary' | 'comparison' | 'extraction' | 'visualization';
}

export interface AnalysisResponse {
  result: string;
  data?: any[];
  chartType?: 'bar' | 'pie' | 'line';
}

const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const PythonBackend = {
  async analyzeData(request: AnalysisRequest): Promise<AnalysisResponse> {
    // Simulate API delay
    await mockDelay(1500);
    
    // Mock different responses based on query content
    if (request.query.toLowerCase().includes('pie chart')) {
      return {
        result: "Generated pie chart visualization of the document data.",
        data: [
          { name: 'Category A', value: 400 },
          { name: 'Category B', value: 300 },
          { name: 'Category C', value: 300 },
          { name: 'Category D', value: 200 },
        ],
        chartType: 'pie'
      };
    } else if (request.query.toLowerCase().includes('bar chart')) {
      return {
        result: "Generated bar chart visualization of the document data.",
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 500 },
          { name: 'Apr', value: 200 },
          { name: 'May', value: 350 },
          { name: 'Jun', value: 450 },
        ],
        chartType: 'bar'
      };
    } else if (request.query.toLowerCase().includes('line chart')) {
      return {
        result: "Generated line chart visualization of the document trends.",
        data: [
          { name: 'Jan', value: 400 },
          { name: 'Feb', value: 300 },
          { name: 'Mar', value: 500 },
          { name: 'Apr', value: 200 },
          { name: 'May', value: 350 },
          { name: 'Jun', value: 450 },
        ],
        chartType: 'line'
      };
    } else {
      return {
        result: "Analyzed the document content: The documents contain information about financial trends and market analysis for Q1-Q2 2024.",
      };
    }
  },
  
  async generateReport(query: string, documents: string[]): Promise<Blob> {
    // Simulate API delay
    await mockDelay(1500);
    
    // Mock report generation - in real app this would come from Python backend
    const csvContent = "name,value\nCategory A,400\nCategory B,300\nCategory C,300\nCategory D,200";
    return new Blob([csvContent], { type: 'text/csv' });
  }
};

export default PythonBackend;
