import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Transaction } from "@/types/payment";

interface ExportButtonProps {
  data: Transaction[];
  filename?: string;
}

export function ExportButton({ data, filename = "transactions_export" }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const headers = ["Payment ID", "Order ID", "Date", "Customer", "Type", "Method", "Amount", "Status"];
    
    const rows = data.map(t => [
      t.id,
      t.orderId,
      `"${t.date}"`,
      `"${t.customerName}"`,
      t.orderType,
      t.paymentMethod,
      t.amount,
      t.status
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
