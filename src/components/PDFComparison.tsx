
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFDocument } from "@/types/pdf";

interface PDFComparisonProps {
  documents: PDFDocument[];
}

const PDFComparison: React.FC<PDFComparisonProps> = ({ documents }) => {
  if (documents.length < 2) {
    return <div>Please select at least two documents to compare.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Document Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.slice(0, 2).map((doc, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{doc.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p className="text-muted-foreground">Pages: {doc.pages}</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {/* Simulated key points for demonstration */}
                    <li>This is a simulated key point from the document</li>
                    <li>Another important concept from this PDF</li>
                    <li>A third significant item extracted from the text</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Comparison Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="similarities">
            <TabsList className="mb-4">
              <TabsTrigger value="similarities">Similarities</TabsTrigger>
              <TabsTrigger value="differences">Differences</TabsTrigger>
            </TabsList>
            <TabsContent value="similarities">
              <div className="p-4 bg-blue-50 rounded-md text-sm">
                <h4 className="font-medium mb-2">Common Points:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>This is a simulated common point between documents</li>
                  <li>Both documents mention this similar concept</li>
                  <li>This topic appears in both documents with similar context</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="differences">
              <div className="p-4 bg-amber-50 rounded-md text-sm">
                <h4 className="font-medium mb-2">Key Differences:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Document 1 focuses on X while Document 2 emphasizes Y</li>
                  <li>This concept is presented differently in each document</li>
                  <li>Document 1 includes this information that is absent in Document 2</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFComparison;
