import { useState } from "react";
import { usePOSStore } from "@/store/usePOSStore";
import { useStaffStore } from "@/store/useStaffStore";
import { X, Wallet, QrCode, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PaymentModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [method, setMethod] = useState<string>("cash");
  const [cashAmount, setCashAmount] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const { cart, grandTotal, subtotal, tax, service, orderType, selectedTable, customerInfo, resetPOS } = usePOSStore();
  const { createOrder } = useStaffStore();

  const handleProcess = () => {
    if (method === "cash") {
      const amount = parseInt(cashAmount.replace(/\D/g, "") || "0");
      if (amount < grandTotal) {
        toast.error("Insufficient cash amount");
        return;
      }
    }

    // Submit to store
    const newOrderId = createOrder({
      customerName: customerInfo?.name || "Guest",
      type: orderType || "dine-in",
      tableNumber: selectedTable || undefined,
      items: cart,
      subtotal,
      tax,
      total: grandTotal,
      status: "confirmed", // auto confirmed to kitchen
      paymentStatus: "paid",
      paymentMethod: method,
    });

    setOrderId(newOrderId);
    setIsSuccess(true);
    toast.success("Payment successful!");
  };

  const handleDone = () => {
    resetPOS();
    router.push("/cashier/dashboard");
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Order <span className="font-bold text-foreground">{orderId}</span> has been sent to the kitchen.
          </p>
          
          <div className="w-full space-y-3">
            <Button variant="outline" className="w-full py-6">
              Print Receipt
            </Button>
            <Button onClick={handleDone} className="w-full py-6 bg-primary text-white">
              Create New Order
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const changeAmount = method === "cash" && cashAmount 
    ? Math.max(0, parseInt(cashAmount.replace(/\D/g, "") || "0") - grandTotal)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif">Process Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left: Methods */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto">
            <h3 className="font-medium text-muted-foreground mb-4">Payment Method</h3>
            <div className="space-y-3">
              {[
                { id: "cash", label: "Cash", icon: Wallet },
                { id: "qris", label: "QRIS", icon: QrCode },
                { id: "card", label: "Debit / Credit", icon: CreditCard },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                    method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-background"
                  )}
                >
                  <m.icon className={cn("w-6 h-6", method === m.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="font-bold flex-1">{m.label}</span>
                  {method === m.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                </button>
              ))}
            </div>

            {method === "cash" && (
              <div className="mt-6 space-y-2 animate-in fade-in duration-200">
                <label className="text-sm font-medium">Cash Received</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                  <input
                    type="text"
                    value={cashAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCashAmount(val ? parseInt(val).toLocaleString("id-ID") : "");
                    }}
                    className="w-full pl-12 pr-4 py-4 rounded-xl text-lg font-bold bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
                    placeholder="0"
                    autoFocus
                  />
                </div>
                
                {/* Quick amount buttons */}
                <div className="flex gap-2 mt-2">
                  {[50000, 100000, 150000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setCashAmount(amt.toLocaleString("id-ID"))}
                      className="flex-1 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
                    >
                      {amt / 1000}k
                    </button>
                  ))}
                  <button 
                    onClick={() => setCashAmount(grandTotal.toLocaleString("id-ID"))}
                    className="flex-1 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    Exact
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="w-full md:w-1/2 p-6 bg-muted/20 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-muted-foreground mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Rp {tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium">Rp {service.toLocaleString("id-ID")}</span>
                </div>
                <div className="w-full h-px bg-border my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>

                {method === "cash" && (
                  <>
                    <div className="flex justify-between mt-4">
                      <span className="text-muted-foreground">Cash Received</span>
                      <span className="font-medium">Rp {cashAmount || "0"}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-green-600 dark:text-green-400">
                      <span>Change</span>
                      <span>Rp {changeAmount.toLocaleString("id-ID")}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button 
              onClick={handleProcess} 
              className="w-full py-6 mt-8 text-lg rounded-xl shadow-lg"
              disabled={method === "cash" && parseInt(cashAmount.replace(/\D/g, "") || "0") < grandTotal}
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
