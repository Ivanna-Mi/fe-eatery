"use client";

import { BarChart3, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "sonner";

export default function ReportsPage() {
  const reportTypes = [
    { title: "Daily Sales Report", desc: "Detailed breakdown of daily revenue, orders, and payment methods." },
    { title: "Monthly Sales Report", desc: "Aggregated monthly performance metrics and trends." },
    { title: "Best Selling Menu", desc: "Analysis of the most popular items and categories." },
    { title: "Stock Usage & Wastage", desc: "Inventory consumption rates and low stock history." },
    { title: "Customer Growth", desc: "Loyalty program signups, retention, and reward usage." },
  ];

  const handleDownload = (reportTitle: string, format: 'PDF' | 'Excel') => {
    toast.success(`Downloading ${reportTitle} as ${format}...`);
    
    // Create a mock file blob to trigger browser download
    const filename = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_report.${format === 'PDF' ? 'pdf' : 'xlsx'}`;
    const content = `Mock ${format} report for ${reportTitle}.\n\nIn a real app, this would be a proper ${format} file.`;
    
    // Use generic MIME types for the mock download
    const mimeType = format === 'PDF' 
      ? 'application/pdf' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary" /> Reports & Exports
        </h1>
        <p className="text-muted-foreground mt-1">Generate and export business intelligence reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, i) => (
          <Card key={i} className="bg-card border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <FileText className="w-8 h-8 text-primary/70 mb-4" />
              <h3 className="text-xl font-bold mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 h-10">{report.desc}</p>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  variant="outline"
                  onClick={() => handleDownload(report.title, 'PDF')}
                >
                  <Download className="w-4 h-4" /> PDF
                </Button>
                <Button 
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleDownload(report.title, 'Excel')}
                >
                  <Download className="w-4 h-4" /> Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
