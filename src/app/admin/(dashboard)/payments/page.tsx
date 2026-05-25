"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, CreditCard, Banknote, QrCode, Smartphone, Search } from "lucide-react";

const initialPayments = [
  { id: "PAY-001", orderId: "ORD-001", amount: "Rp 85.000", method: "QRIS", date: "27 Oct, 14:30", status: "paid" },
  { id: "PAY-002", orderId: "ORD-002", amount: "Rp 45.000", method: "Cash", date: "27 Oct, 14:15", status: "paid" },
  { id: "PAY-003", orderId: "ORD-003", amount: "Rp 110.000", method: "Debit", date: "27 Oct, 13:50", status: "paid" },
  { id: "PAY-004", orderId: "ORD-004", amount: "Rp 55.000", method: "E-wallet", date: "27 Oct, 13:20", status: "pending" },
  { id: "PAY-005", orderId: "ORD-005", amount: "Rp 120.000", method: "QRIS", date: "27 Oct, 12:45", status: "failed" },
];

const getMethodIcon = (method: string) => {
  switch (method) {
    case "QRIS": return <QrCode className="w-4 h-4" />;
    case "Cash": return <Banknote className="w-4 h-4" />;
    case "Debit": return <CreditCard className="w-4 h-4" />;
    case "E-wallet": return <Smartphone className="w-4 h-4" />;
    default: return <CreditCard className="w-4 h-4" />;
  }
};

export default function AdminPaymentsPage() {
  const [payments] = useState(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("All Methods");

  // Only show completed (paid) payments
  const completedPayments = payments.filter(pay => pay.status === "paid");

  const filteredPayments = completedPayments.filter(pay => {
    const matchesSearch = pay.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pay.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === "All Methods" || pay.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  const handleExportCSV = () => {
    // 1. Create CSV header
    const headers = ["Transaction ID", "Order Ref", "Date", "Method", "Amount", "Status"];
    
    // 2. Convert data rows to CSV format
    const csvRows = filteredPayments.map(pay => {
      // Removing "Rp " and "." from amount to make it a clean number in CSV, or keep it as is
      return [pay.id, pay.orderId, `"${pay.date}"`, pay.method, `"${pay.amount}"`, pay.status].join(",");
    });
    
    // 3. Combine header and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // 4. Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payments_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Payment History</h1>
          <p className="text-muted-foreground">Riwayat transaksi pembayaran yang telah selesai.</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="border-border text-foreground rounded-full px-6 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      <Card className="border-none shadow-md bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search transaction or order ID..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" 
              />
            </div>
            <select 
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-4 py-2 text-sm rounded-lg border border-border/50 bg-background outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All Methods</option>
              <option>Cash</option>
              <option>QRIS</option>
              <option>Debit</option>
              <option>E-wallet</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Order Ref</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Method</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No payments found matching your filters.</td>
                  </tr>
                ) : filteredPayments.map((pay, i) => (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} key={pay.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-mono text-xs">{pay.id}</td>
                    <td className="px-6 py-4 font-bold text-primary">{pay.orderId}</td>
                    <td className="px-6 py-4 text-muted-foreground">{pay.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-background rounded-md text-muted-foreground">
                          {getMethodIcon(pay.method)}
                        </div>
                        <span className="font-medium">{pay.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">{pay.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        pay.status === 'paid' ? 'bg-green-500/10 text-green-600' :
                        pay.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:underline font-medium text-xs">Details</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
