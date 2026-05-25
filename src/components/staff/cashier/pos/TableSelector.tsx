import { useStaffStore } from "@/store/useStaffStore";
import { usePOSStore } from "@/store/usePOSStore";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function TableSelector() {
  const { tables } = useStaffStore();
  const { setSelectedTable, setOrderType } = usePOSStore();

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto p-6 min-h-[60vh]">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => setOrderType(null)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-3xl font-serif font-bold">Select Table</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tables.map((table) => {
          const isAvailable = table.status === "available";
          return (
            <button
              key={table.id}
              disabled={!isAvailable}
              onClick={() => setSelectedTable(table.id)}
              className={cn(
                "relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 h-32",
                isAvailable ? "bg-card hover:bg-primary/5 border-border hover:border-primary cursor-pointer active:scale-95" :
                table.status === "occupied" ? "bg-red-500/10 border-red-500/30 cursor-not-allowed opacity-70" :
                "bg-yellow-500/10 border-yellow-500/30 cursor-not-allowed opacity-70"
              )}
            >
              <div className="text-2xl font-bold mb-2">T-{table.number}</div>
              <div className="flex items-center text-sm text-muted-foreground gap-1">
                <Users className="w-4 h-4" /> {table.capacity}
              </div>
              
              {!isAvailable && (
                <div className="absolute top-2 right-2 flex">
                  <span className={cn(
                    "text-[10px] uppercase font-bold px-2 py-1 rounded-full",
                    table.status === "occupied" ? "bg-red-500 text-white" : "bg-yellow-500 text-white"
                  )}>
                    {table.status}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
