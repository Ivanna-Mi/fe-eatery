import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StockItem } from "@/types/stock";

interface ExportStockButtonProps {
  data: StockItem[];
  filename?: string;
}

export function ExportStockButton({ data, filename = "inventory_export" }: ExportStockButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Item Code", "Name", "Category", "Quantity", "Status", "Last Updated"];
    
    const rows = data.map(t => [
      t.id,
      `"${t.name}"`,
      t.category,
      `"${t.quantity}"`,
      t.status,
      `"${t.lastUpdated}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleExport} className="gap-2 shadow-sm">
      <Download className="w-4 h-4" /> Export CSV
    </Button>
  );
}
