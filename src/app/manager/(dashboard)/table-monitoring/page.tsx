"use client";

import { Armchair, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TableMonitoringPage() {
  const tables = Array.from({ length: 12 }, (_, i) => {
    const id = i + 1;
    let status = "Available";
    let details = "";
    if (id === 2 || id === 5) {
      status = "Occupied";
      details = "45 mins - Rp 350.000";
    } else if (id === 8) {
      status = "Reserved";
      details = "19:00 for 4 pax";
    }
    return { id: `T-${id.toString().padStart(2, '0')}`, status, details };
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight flex items-center gap-2">
          <Armchair className="w-8 h-8 text-primary" /> Table Monitoring
        </h1>
        <p className="text-muted-foreground mt-1">Live overview of cafe seating and table turnover.</p>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Available</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Occupied</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> Reserved</div>
      </div>

      <Card className="bg-card/50 border-border/50 shadow-sm p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
          {tables.map(table => (
            <div 
              key={table.id}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center space-y-3 transition-transform hover:scale-105 cursor-pointer
                ${table.status === 'Available' ? 'border-green-500/30 bg-green-500/5 hover:border-green-500' :
                  table.status === 'Occupied' ? 'border-red-500/50 bg-red-500/10 hover:border-red-500' :
                  'border-yellow-500/50 bg-yellow-500/10 hover:border-yellow-500'
                }
              `}
            >
              <h3 className="text-xl font-bold">{table.id}</h3>
              <Users className={`w-8 h-8 opacity-50 ${table.status === 'Occupied' ? 'text-red-500' : ''}`} />
              <div className="text-center">
                <p className={`text-xs font-bold uppercase tracking-wider
                  ${table.status === 'Available' ? 'text-green-500' :
                    table.status === 'Occupied' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}
                >
                  {table.status}
                </p>
                {table.details && <p className="text-xs text-muted-foreground mt-1 font-medium">{table.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
