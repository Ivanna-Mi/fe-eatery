import { Utensils, ShoppingBag } from "lucide-react";
import { usePOSStore } from "@/store/usePOSStore";
import { OrderType } from "@/store/useStaffStore";
import { cn } from "@/lib/utils";

export function OrderTypeSelector() {
  const { setOrderType } = usePOSStore();

  const types: { id: OrderType; label: string; icon: any; desc: string }[] = [
    { id: "dine-in", label: "Dine In", icon: Utensils, desc: "Eat at the restaurant" },
    { id: "takeaway", label: "Takeaway", icon: ShoppingBag, desc: "Pick up and go" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-serif font-bold mb-8">Select Order Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setOrderType(type.id)}
            className={cn(
              "flex flex-col items-center p-8 rounded-2xl border-2 transition-all duration-200",
              "bg-card hover:bg-primary/5 border-border hover:border-primary/50",
              "active:scale-95"
            )}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <type.icon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{type.label}</h3>
            <p className="text-muted-foreground text-center">{type.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
