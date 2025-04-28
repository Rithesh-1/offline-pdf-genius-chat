
import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Save, PieChart as PieChartIcon, BarChart as BarChartIcon } from "lucide-react";

interface DataVisualizationProps {
  data?: any[];
  title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const sampleData = [
  { name: 'Page A', value: 400 },
  { name: 'Page B', value: 300 },
  { name: 'Page C', value: 300 },
  { name: 'Page D', value: 200 },
  { name: 'Page E', value: 278 },
  { name: 'Page F', value: 189 },
];

const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  data = sampleData,
  title = "Data Visualization"
}) => {
  const [activeChart, setActiveChart] = useState<string>("bar");
  
  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "name,value\n" 
      + data.map(item => `${item.name},${item.value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveChart = () => {
    // In a real implementation, this would save the chart as an image
    // For this demo, we'll just download the CSV
    downloadCSV();
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={saveChart}>
              <Save size={16} className="mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCSV}>
              <Download size={16} className="mr-2" />
              Download CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeChart} onValueChange={setActiveChart}>
          <TabsList className="mb-4">
            <TabsTrigger value="bar" className="flex items-center gap-1">
              <BarChartIcon size={16} />
              Bar
            </TabsTrigger>
            <TabsTrigger value="pie" className="flex items-center gap-1">
              <PieChartIcon size={16} />
              Pie
            </TabsTrigger>
            <TabsTrigger value="line" className="flex items-center gap-1">
              <BarChartIcon size={16} />
              Line
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="mt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="pie" className="mt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="line" className="mt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
