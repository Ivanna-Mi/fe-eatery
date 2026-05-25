import { useState } from "react";
import { X, Tag, Gift, Ticket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePOSStore } from "@/store/usePOSStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RedeemModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"voucher" | "points">("points");
  const [voucherCode, setVoucherCode] = useState("");
  const { applyDiscount, subtotal } = usePOSStore();

  const dummyRewards = [
    { id: "R1", name: "Free Espresso", points: 50, discountValue: 15000, icon: "☕" },
    { id: "R2", name: "Rp 25.000 Off", points: 100, discountValue: 25000, icon: "💰" },
    { id: "R3", name: "20% Discount", points: 150, discountValue: Math.round(subtotal * 0.2), icon: "🏷️" },
  ];

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;
    
    // Dummy voucher logic
    if (voucherCode.toUpperCase() === "PROMO20") {
      applyDiscount(20000, "Voucher PROMO20");
      toast.success("Voucher applied! Rp 20.000 off");
      onClose();
    } else {
      toast.error("Invalid voucher code");
    }
  };

  const handleRedeemPoint = (reward: typeof dummyRewards[0]) => {
    applyDiscount(reward.discountValue, `Reward: ${reward.name}`);
    toast.success(`Redeemed ${reward.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            Promo & Rewards
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            className={cn("flex-1 py-3 font-medium transition-colors", tab === "points" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setTab("points")}
          >
            Redeem Points
          </button>
          <button
            className={cn("flex-1 py-3 font-medium transition-colors", tab === "voucher" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}
            onClick={() => setTab("voucher")}
          >
            Voucher Code
          </button>
        </div>

        <div className="p-6">
          {tab === "points" ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-muted/50 p-4 rounded-xl mb-4">
                <span className="font-medium">Customer Points</span>
                <span className="text-xl font-bold text-primary">245 pts</span>
              </div>
              
              <div className="space-y-3">
                {dummyRewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/50 transition-colors bg-background">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{reward.icon}</div>
                      <div>
                        <h4 className="font-bold">{reward.name}</h4>
                        <p className="text-sm text-muted-foreground">{reward.points} points</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleRedeemPoint(reward)}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Redeem
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Voucher Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="e.g. PROMO20"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none uppercase"
                    />
                  </div>
                  <Button onClick={handleApplyVoucher} className="px-6 py-3 h-auto">
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Try using code "PROMO20" for testing.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
