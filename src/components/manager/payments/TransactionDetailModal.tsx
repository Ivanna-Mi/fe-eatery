import * as React from "react";
import { X, Receipt, Wallet, CalendarClock, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransactionDetail } from "@/types/payment";

interface TransactionDetailModalProps {
  transaction: TransactionDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({ transaction, isOpen, onClose }: TransactionDetailModalProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>
      
      <div className="relative z-50 w-full max-w-3xl bg-card border border-border/50 shadow-xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
          <div>
            <h2 className="text-xl font-serif font-bold flex items-center gap-2">
              Transaction Details
              <StatusBadge status={transaction.status} className="ml-2" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Payment ID: {transaction.id}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
                <Receipt className="w-4 h-4 text-primary" /> Order Information
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium text-right">{transaction.orderId}</span>
                <span className="text-muted-foreground">Order Type:</span>
                <span className="font-medium text-right">{transaction.orderType}</span>
                {transaction.tableNumber && (
                  <>
                    <span className="text-muted-foreground">Table:</span>
                    <span className="font-medium text-right">{transaction.tableNumber}</span>
                  </>
                )}
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-right">{transaction.date}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
                <User className="w-4 h-4 text-primary" /> Customer & Payment
              </h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-right">{transaction.customerName}</span>
                <span className="text-muted-foreground">Method:</span>
                <span className="font-medium text-right">{transaction.paymentMethod}</span>
                {transaction.voucherUsed && (
                  <>
                    <span className="text-muted-foreground">Voucher:</span>
                    <span className="font-medium text-right text-green-600">{transaction.voucherUsed}</span>
                  </>
                )}
                {transaction.loyaltyPointsEarned && (
                  <>
                    <span className="text-muted-foreground">Points Earned:</span>
                    <span className="font-medium text-right text-yellow-600">+{transaction.loyaltyPointsEarned} pts</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
              <Hash className="w-4 h-4 text-primary" /> Ordered Items
            </h3>
            <div className="bg-muted/20 rounded-xl p-4 border border-border/50">
              <div className="space-y-3">
                {transaction.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-medium">
                      <span className="text-muted-foreground mr-2">{item.quantity}x</span>
                      {item.name}
                    </span>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span>Rp {transaction.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total Amount</span>
                  <span className="text-primary">Rp {transaction.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2 border-b border-border/50 pb-2">
              <CalendarClock className="w-4 h-4 text-primary" /> Payment Timeline
            </h3>
            <div className="pl-2 space-y-6">
              {transaction.timeline.map((event, i) => (
                <div key={i} className="relative pl-6">
                  {i !== transaction.timeline.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-[-24px] w-px bg-border"></div>
                  )}
                  <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 
                    ${i === transaction.timeline.length - 1 ? 'bg-primary border-primary ring-4 ring-primary/20' : 'bg-background border-muted-foreground'}`}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-0.5">{event.timestamp}</span>
                    <span className="text-sm font-medium">{event.status}</span>
                    {event.note && <span className="text-xs text-muted-foreground mt-0.5">{event.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/20 flex justify-end">
          <Button onClick={onClose}>Close Details</Button>
        </div>

      </div>
    </div>
  );
}
