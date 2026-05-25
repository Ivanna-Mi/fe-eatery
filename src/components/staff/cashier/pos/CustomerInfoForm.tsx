import { useState } from "react";
import { usePOSStore } from "@/store/usePOSStore";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CustomerInfoForm() {
  const { orderType, setCustomerInfo, setOrderType } = usePOSStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerInfo({ name, phone });
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto p-6 min-h-[60vh]">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => setOrderType(null)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-3xl font-serif font-bold">Customer Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Customer Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number (Optional)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-4 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary outline-none"
            placeholder="081234567890"
          />
        </div>

        <Button type="submit" className="w-full py-6 text-lg rounded-xl">
          Continue to Menu
        </Button>
      </form>
    </div>
  );
}
