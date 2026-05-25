"use client";

import * as React from "react";
import { useStaffStore } from "@/store/useStaffStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Armchair } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CashierTables() {
  const { tables } = useStaffStore();

  const getTableStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-500/10 border-green-500/30 text-green-600';
      case 'occupied': return 'bg-red-500/10 border-red-500/30 text-red-600';
      case 'reserved': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600';
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-600';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold">Table Management</h2>
          <p className="text-muted-foreground">Monitor and assign cafe tables.</p>
        </div>
        
        <div className="flex gap-4 text-sm font-medium">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Occupied</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Reserved</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map(table => (
          <Card key={table.id} className={cn("border-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer", getTableStatusColor(table.status))}>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <Armchair className="w-10 h-10 opacity-80" />
              <div>
                <h3 className="font-bold text-2xl">Table {table.number}</h3>
                <div className="flex items-center justify-center gap-1 mt-1 opacity-80 text-sm">
                  <Users className="w-4 h-4" /> <span>{table.capacity} Seats</span>
                </div>
              </div>
              <div className="pt-2">
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", getTableStatusColor(table.status).replace('border-', 'bg-').replace('/10', '/20'))}>
                  {table.status}
                </span>
              </div>
              {table.currentOrderId && (
                <div className="text-xs font-bold mt-2 opacity-80">
                  {table.currentOrderId}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
