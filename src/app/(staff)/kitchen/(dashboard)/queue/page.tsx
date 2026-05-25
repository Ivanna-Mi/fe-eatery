"use client";

import * as React from "react";
import { useStaffStore } from "@/store/useStaffStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Flame, CheckCircle, Clock, AlertTriangle, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KitchenQueue() {
  const { orders, startPreparing, markReady } = useStaffStore();

  const queueOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing')
    .sort((a, b) => {
      // Sort preparing first, then confirmed
      if (a.status === 'preparing' && b.status === 'confirmed') return -1;
      if (a.status === 'confirmed' && b.status === 'preparing') return 1;
      return 0;
    });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flame className="text-orange-500" /> Active Tickets ({queueOrders.length})
        </h2>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> New Order</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div> Cooking</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {queueOrders.map(order => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className={`bg-card border-2 shadow-sm h-full flex flex-col ${order.status === 'preparing' ? 'border-orange-500/50' : 'border-blue-500/30'}`}>
                <div className={`p-3 font-bold text-lg flex justify-between items-center ${order.status === 'preparing' ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600'}`}>
                  <span>{order.id}</span>
                  <span className="flex items-center gap-1 text-sm"><Clock className="w-4 h-4" /> {order.time}</span>
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/50">
                    <div>
                      <p className="text-muted-foreground text-sm">Customer</p>
                      <p className="font-bold text-lg">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">{order.type.toUpperCase()}</p>
                      <p className="font-bold text-xl">{order.tableNumber || '-'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6 flex-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-3 text-lg">
                        <div className="font-bold text-orange-600 bg-orange-500/10 px-2 py-1 rounded h-fit">
                          {item.qty}x
                        </div>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          {item.notes && (
                            <p className="text-sm text-yellow-600 mt-1 flex items-start gap-1">
                              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/50">
                    {order.status === 'confirmed' ? (
                      <Button 
                        className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 text-white" 
                        onClick={() => startPreparing(order.id)}
                      >
                        <Flame className="w-5 h-5 mr-2" /> Start Cooking
                      </Button>
                    ) : (
                      <Button 
                        className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 text-white animate-pulse hover:animate-none" 
                        onClick={() => markReady(order.id)}
                      >
                        <CheckCircle className="w-5 h-5 mr-2" /> Mark as Ready
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {queueOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <ChefHat className="w-24 h-24 mb-4 opacity-20" />
          <h2 className="text-2xl font-bold">Kitchen is clear!</h2>
          <p>Waiting for new orders to arrive...</p>
        </div>
      )}
    </div>
  );
}
