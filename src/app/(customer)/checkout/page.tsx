"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowLeft, Utensils, ShoppingBag, CheckCircle2, Wallet, CreditCard, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const isGuest = status === "unauthenticated";
  
  const router = useRouter();
  const { clearCart, cartTotal, discount } = useStore();

  const [step, setStep] = React.useState(1);
  const [orderType, setOrderType] = React.useState<"dine_in" | "take_away" | "">("");
  const [tableNo, setTableNo] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"qris" | "e-wallet" | "debit" | "cash" | "">("");

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleNext = () => {
    if (step === 1 && !orderType) {
      toast.error("Please select an order type");
      return;
    }
    if (step === 2) {
      if (orderType === "dine_in" && !tableNo) {
        toast.error("Please enter a table number");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 1) router.back();
    else setStep((s) => s - 1);
  };

  const handleComplete = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setIsProcessing(true);
    // Mock complete process
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      setStep(4);
    }, 1500);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      {step < 4 && (
        <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-md px-4 pt-8 pb-4 flex items-center space-x-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-bold">Checkout</h1>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                Step {step} of 3
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>
      )}

      <div className="flex-1 p-4 md:p-8 overflow-hidden relative max-w-3xl mx-auto w-full">
        {isGuest && step < 4 && (
          <Card className="mb-6 bg-primary/10 border-primary/20">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-primary">Checking out as Guest</h3>
                <p className="text-sm text-muted-foreground">Sign in to earn loyalty points on this order!</p>
              </div>
              <Link href="/login">
                <Button variant="outline" size="sm" className="whitespace-nowrap rounded-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <AnimatePresence custom={1} mode="wait">
          
          {/* STEP 1: ORDER TYPE */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="space-y-8 w-full"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">How would you like your order?</h2>
                <p className="text-muted-foreground mb-6">Select your preferred dining option.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "dine_in", label: "Dine In", icon: Utensils, desc: "Eat at our Kopitiam" },
                    { id: "take_away", label: "Take Away", icon: ShoppingBag, desc: "Pick up yourself" },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = orderType === type.id;
                    return (
                      <Card 
                        key={type.id} 
                        className={`cursor-pointer transition-all border-2 h-full ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                        onClick={() => setOrderType(type.id as any)}
                      >
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className={`p-4 rounded-full ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            <Icon className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <Button 
                className="w-full mt-8" 
                size="lg" 
                disabled={!orderType}
                onClick={handleNext}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6 w-full"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {orderType === "dine_in" ? "Where are you seated?" : "Pickup Details"}
                </h2>
                
                {orderType === "dine_in" && (
                  <div className="mt-6 space-y-4">
                    <label className="block text-sm font-semibold text-muted-foreground">Table Number</label>
                    <input
                      type="number"
                      placeholder="e.g. 12"
                      value={tableNo}
                      onChange={(e) => setTableNo(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-muted border-none text-xl outline-none focus:ring-2 focus:ring-primary text-center font-bold"
                    />
                  </div>
                )}

                {orderType === "take_away" && (
                  <div className="mt-6 p-6 bg-muted rounded-2xl text-center">
                    <ShoppingBag className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold mb-2">Pickup at Counter</h3>
                    <p className="text-muted-foreground text-sm">We'll notify you when your order is ready for pickup.</p>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-8" 
                size="lg" 
                disabled={
                  (orderType === "dine_in" && !tableNo)
                }
                onClick={handleNext}
              >
                Continue to Payment
              </Button>
            </motion.div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6 w-full"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "qris", label: "QRIS", icon: Wallet },
                    { id: "e-wallet", label: "E-Wallet (GoPay, OVO)", icon: Wallet },
                    { id: "debit", label: "Debit / Credit Card", icon: CreditCard },
                    { id: "cash", label: "Cash to Cashier", icon: Banknote },
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = paymentMethod === type.id;
                    return (
                      <Card 
                        key={type.id} 
                        className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
                        onClick={() => setPaymentMethod(type.id as any)}
                      >
                        <CardContent className="p-4 flex items-center space-x-4">
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="font-bold">{type.label}</h3>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="mt-8 bg-muted border-none shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm mb-3 text-muted-foreground uppercase tracking-wider">Order Summary</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm font-medium">Rp {cartTotal().toLocaleString('id-ID')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center mb-2 text-green-500">
                        <span className="text-sm">Discount</span>
                        <span className="text-sm font-medium">- Rp {discount.toLocaleString('id-ID')}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Tax (11%)</span>
                      <span className="text-sm font-medium">Rp {((cartTotal() - discount) * 0.11).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold">Total Payment</span>
                      <span className="text-xl font-bold text-primary">
                        Rp {(((cartTotal() - discount) * 1.11)).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Button 
                className="w-full mt-4 h-14 text-lg rounded-2xl" 
                size="lg" 
                disabled={!paymentMethod || isProcessing}
                isLoading={isProcessing}
                onClick={handleComplete}
              >
                Confirm & Pay Rp {(((cartTotal() - discount) * 1.11)).toLocaleString('id-ID')}
              </Button>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="mb-8 text-green-500"
              >
                <CheckCircle2 className="w-32 h-32" />
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4">Order Received!</h2>
              <p className="text-muted-foreground mb-2">Order #ORD-{Math.floor(Math.random() * 9000) + 1000}</p>
              <p className="text-muted-foreground mb-8">We're preparing your food right now.</p>
              
              <Button 
                className="w-full max-w-[200px]" 
                size="lg" 
                onClick={() => router.push("/orders")}
              >
                Track Order
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
