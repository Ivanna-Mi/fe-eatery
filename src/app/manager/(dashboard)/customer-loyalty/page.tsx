"use client";

import * as React from "react";
import { DataTable } from "@/components/manager/ui/DataTable";
import { Users, Star, Gift, TicketPercent, Filter } from "lucide-react";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";

const mockCustomers = [
  { id: "CUST-001", name: "John Doe", level: "Gold", points: 1250, totalSpent: "Rp 2.500.000", lastVisit: "Today" },
  { id: "CUST-002", name: "Jane Smith", level: "Silver", points: 840, totalSpent: "Rp 1.200.000", lastVisit: "Yesterday" },
  { id: "CUST-003", name: "Budi", level: "Bronze", points: 150, totalSpent: "Rp 350.000", lastVisit: "2 Days Ago" },
  { id: "CUST-004", name: "Siti", level: "Gold", points: 2100, totalSpent: "Rp 5.100.000", lastVisit: "Today" },
];

export default function CustomerLoyaltyPage() {
  const [levelFilter, setLevelFilter] = React.useState("All");

  const filteredCustomers = React.useMemo(() => {
    if (levelFilter === "All") return mockCustomers;
    return mockCustomers.filter(c => c.level === levelFilter);
  }, [levelFilter]);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Customer Loyalty
        </h1>
        <p className="text-muted-foreground mt-1">Analyze membership growth, point redemptions, and voucher usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Members" value="1,245" icon={Users} trend={8.4} />
        <AnalyticsCard title="Points Redeemed" value="45,000" icon={Star} trend={12.5} />
        <AnalyticsCard title="Active Vouchers" value="3" icon={TicketPercent} />
      </div>

      <DataTable 
        title="Top Loyal Customers"
        description="Customers sorted by total points"
        actionNode={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-sm bg-background border border-border/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>
        }
        columns={[
          { header: "Name", accessorKey: "name" },
          { 
            header: "Level", 
            accessorKey: "level",
            cell: (row) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                ${row.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-600' : 
                  row.level === 'Silver' ? 'bg-slate-300/20 text-slate-500' : 
                  'bg-orange-700/20 text-orange-700'}`}
              >
                {row.level}
              </span>
            )
          },
          { header: "Points", accessorKey: "points" },
          { header: "Total Spent", accessorKey: "totalSpent" },
          { header: "Last Visit", accessorKey: "lastVisit" },
        ]}
        data={filteredCustomers}
      />
    </div>
  );
}
