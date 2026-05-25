"use client";

import * as React from "react";
import { useStaffStore, StaffOrder } from "@/store/useStaffStore";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Check, X, Clock, ChefHat, CheckCircle, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function CashierOrders() {
  const { orders, confirmOrder, cancelOrder, serveOrder } = useStaffStore();
  const [filter, setFilter] = React.useState('all');

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  
  const filteredOrders = activeOrders.filter(o => {
    if (filter === 'all') return true;
    return o.type === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'created': return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded text-xs font-bold">NEW</span>;
      case 'confirmed': return <span className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded text-xs font-bold">CONFIRMED</span>;
      case 'preparing': return <span className="px-2 py-1 bg-orange-500/20 text-orange-600 rounded text-xs font-bold">COOKING</span>;
      case 'ready': return <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded text-xs font-bold">READY</span>;
      case 'served': return <span className="px-2 py-1 bg-gray-500/20 text-gray-600 rounded text-xs font-bold">SERVED</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold">Incoming Orders</h2>
          <p className="text-muted-foreground">Manage order queue and send to kitchen.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="rounded-full">All</Button>
          <Button variant={filter === 'dine-in' ? 'default' : 'outline'} onClick={() => setFilter('dine-in')} className="rounded-full">Dine In</Button>
          <Button variant={filter === 'takeaway' ? 'default' : 'outline'} onClick={() => setFilter('takeaway')} className="rounded-full">Takeaway</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <Card key={order.id} className="bg-card border-none shadow-sm flex flex-col justify-between overflow-hidden">
            {order.status === 'created' && <div className="h-1 bg-yellow-500 w-full" />}
            {order.status === 'ready' && <div className="h-1 bg-green-500 w-full" />}
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.customerName} • {order.type} {order.tableNumber ? `(${order.tableNumber})` : ''}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="space-y-2 mb-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.qty}x {item.name}</span>
                    <span className="text-muted-foreground">Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center font-bold mb-6 pt-4 border-t border-border/50">
                <span>Total</span>
                <span className="text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
              </div>

              {/* Actions based on status */}
              <div className="flex gap-2 mt-auto">
                {order.status === 'created' && (
                  <>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => confirmOrder(order.id)}>
                      <Check className="w-4 h-4 mr-2" /> Confirm
                    </Button>
                    <Button variant="outline" className="text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={() => cancelOrder(order.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <Button disabled className="flex-1" variant="secondary">
                    <Clock className="w-4 h-4 mr-2" /> Waiting for Kitchen
                  </Button>
                )}
                
                {order.status === 'preparing' && (
                  <Button disabled className="flex-1" variant="secondary">
                    <ChefHat className="w-4 h-4 mr-2" /> Cooking
                  </Button>
                )}
                
                {order.status === 'ready' && (
                  <Button className="flex-1 bg-primary hover:bg-primary/90 text-white" onClick={() => serveOrder(order.id)}>
                    <Utensils className="w-4 h-4 mr-2" /> Mark Served
                  </Button>
                )}
                
                {order.status === 'served' && (
                  <Button disabled className="flex-1 bg-gray-100 text-gray-500 hover:bg-gray-100">
                    <CheckCircle className="w-4 h-4 mr-2" /> Served
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredOrders.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No active orders found.
          </div>
        )}
      </div>
    </div>
  );
}
