import * as React from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Transaction } from "@/types/payment";

interface TransactionTableProps {
  data: Transaction[];
  isLoading?: boolean;
  onViewDetail: (transaction: Transaction) => void;
}

type SortConfig = { key: keyof Transaction; direction: 'asc' | 'desc' } | null;

export function TransactionTable({ data, isLoading = false, onViewDetail }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({ key: 'date', direction: 'desc' });
  const itemsPerPage = 10;

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof Transaction }) => (
    <th 
      className="px-6 py-4 font-medium cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
      </div>
    </th>
  );

  return (
    <Card className="bg-card border-border/50 shadow-sm w-full">
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/30 text-muted-foreground border-b border-border/50">
            <tr>
              <SortableHeader label="Payment ID" sortKey="id" />
              <SortableHeader label="Order ID" sortKey="orderId" />
              <SortableHeader label="Date & Time" sortKey="date" />
              <SortableHeader label="Customer" sortKey="customerName" />
              <SortableHeader label="Type" sortKey="orderType" />
              <SortableHeader label="Method" sortKey="paymentMethod" />
              <SortableHeader label="Amount" sortKey="amount" />
              <SortableHeader label="Status" sortKey="status" />
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              // Skeleton Loading
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4 font-medium">{tx.id}</td>
                  <td className="px-6 py-4">{tx.orderId}</td>
                  <td className="px-6 py-4 text-muted-foreground">{tx.date}</td>
                  <td className="px-6 py-4">{tx.customerName}</td>
                  <td className="px-6 py-4">{tx.orderType}</td>
                  <td className="px-6 py-4">{tx.paymentMethod}</td>
                  <td className="px-6 py-4 font-medium text-foreground">Rp {tx.amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => onViewDetail(tx)}
                    >
                      <Eye className="w-4 h-4" /> Detail
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && data.length > 0 && (
          <div className="p-4 border-t border-border/50 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, data.length)}</span> of <span className="font-medium text-foreground">{data.length}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium px-2">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
