"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, Filter, Eye, MoreHorizontal, X, Clock, Receipt, User, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminOrdersPage() {
  const { orders, addOrder, updateOrderStatus, updateOrderPaymentStatus, deleteOrder } = useAdminStore();
  
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newOrderItems, setNewOrderItems] = useState<any[]>([]);
  const [orderType, setOrderType] = useState("Dine-in");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("Table 1");

  const handleAddItem = (menuItem: any) => {
    setNewOrderItems(prev => {
      const existing = prev.find(item => item.id === menuItem.id);
      if (existing) {
        return prev.map(item => item.id === menuItem.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...menuItem, qty: 1 }];
    });
  };

  const handleCreateOrder = () => {
    if (!customerName || newOrderItems.length === 0) return;
    
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`, // Random ID since we might delete
      customer: customerName,
      phone: customerPhone,
      address: orderType === "Dine-in" ? `Dine-in (${tableNumber})` : "Takeaway",
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      items: newOrderItems,
      total: `Rp ${newOrderItems.reduce((acc: number, item: any) => acc + (parseInt(item.price.replace(/\D/g, '')) * item.qty), 0).toLocaleString('id-ID')}`,
      status: "created",
      paymentStatus: "pending"
    };

    addOrder(newOrder);
    setIsNewOrderModalOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setNewOrderItems([]);
  };

  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const { menus } = useAdminStore();

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "all" || o.status === filter;
    const matchesSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                          o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-600";
      case "ready": return "bg-primary/10 text-primary";
      case "confirmed": return "bg-blue-500/10 text-blue-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/10 text-green-600";
      case "pending": return "bg-orange-500/10 text-orange-500";
      case "failed": return "bg-red-500/10 text-red-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">Kelola semua pesanan pelanggan di sini.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {
            setNewOrderItems([]);
            setIsNewOrderModalOpen(true);
          }} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-md bg-card">
        <CardContent className="p-0">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search order ID or customer..." 
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full sm:w-auto hide-scrollbar">
              {["all", "created", "confirmed", "ready", "completed"].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition-colors ${filter === status ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No orders match your filter.</td>
                  </tr>
                ) : filteredOrders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-foreground">{order.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{order.items.map((it: any) => it.name).join(", ")}</td>
                    <td className="px-6 py-4 font-bold text-primary">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10" title="View Order Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteOrder(order.id)} className="p-2 text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-500/10" title="Delete Order">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border/50 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold leading-tight">{selectedOrder.id}</h2>
                    <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-border/50 bg-background">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-xs">{item.qty}x</span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="font-bold text-sm">{typeof item.price === 'string' ? item.price : `Rp ${item.price.toLocaleString('id-ID')}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">{selectedOrder.total}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Customer Info</h3>
                    <div className="p-4 rounded-xl border border-border/50 bg-background space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{selectedOrder.customer}</span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-7">{selectedOrder.phone}</div>
                      <div className="text-xs text-muted-foreground ml-7">{selectedOrder.address}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Update Status</h3>
                    <div className="space-y-2">
                      {["created", "confirmed", "ready", "completed"].map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedOrder({...selectedOrder, status});
                            updateOrderStatus(selectedOrder.id, status);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold capitalize transition-colors flex justify-between items-center ${
                            selectedOrder.status === status ? 'bg-primary text-white' : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          {status}
                          {selectedOrder.status === status && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-muted-foreground mb-3 uppercase tracking-wider">Payment Status</h3>
                    <div className="space-y-2">
                      {["pending", "paid", "failed"].map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setSelectedOrder({...selectedOrder, paymentStatus: status});
                            updateOrderPaymentStatus(selectedOrder.id, status);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold capitalize transition-colors flex justify-between items-center ${
                            (selectedOrder.paymentStatus || 'pending') === status ? 'bg-primary text-white' : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                          }`}
                        >
                          {status}
                          {(selectedOrder.paymentStatus || 'pending') === status && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/20">
                <Button variant="outline" onClick={() => setSelectedOrder(null)} className="rounded-full px-6">Close</Button>
                <Button onClick={() => setSelectedOrder(null)} className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg">Done</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Order Modal */}
      <AnimatePresence>
        {isNewOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-border/50 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/30">
                <div>
                  <h2 className="text-xl font-serif font-bold leading-tight">Create New Order</h2>
                  <p className="text-xs text-muted-foreground">Manual order entry for Walk-in or Phone customers.</p>
                </div>
                <button onClick={() => setIsNewOrderModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Customer Info & Order Type */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Customer Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Customer Name</label>
                        <input value={customerName} onChange={e => setCustomerName(e.target.value)} type="text" placeholder="e.g. Budi Santoso" className="w-full px-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
                        <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} type="tel" placeholder="0812..." className="w-full px-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Order Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setOrderType("Dine-in")}
                        className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition-colors ${orderType === "Dine-in" ? "border-2 border-primary bg-primary/5 text-primary" : "border border-border/50 hover:border-primary/50 text-foreground"}`}
                      >
                        Dine-in
                      </button>
                      <button 
                        onClick={() => setOrderType("Takeaway")}
                        className={`px-4 py-3 rounded-xl font-bold text-sm text-center transition-colors ${orderType === "Takeaway" ? "border-2 border-primary bg-primary/5 text-primary" : "border border-border/50 hover:border-primary/50 text-foreground"}`}
                      >
                        Takeaway
                      </button>
                    </div>
                    {orderType === "Dine-in" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Table Number</label>
                        <select value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-full px-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 outline-none">
                          <option>Table 1</option>
                          <option>Table 2</option>
                          <option>Table 3</option>
                          <option>Table 4</option>
                          <option>Table 5</option>
                        </select>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Right Col: Menu Selection */}
                <div className="space-y-6 flex flex-col h-full">
                  <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Select Menu Items</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search menu..." 
                      value={menuSearchQuery}
                      onChange={e => setMenuSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border/50 bg-background focus:ring-2 focus:ring-primary/20 outline-none" 
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 border border-border/50 rounded-xl p-2 bg-muted/10 min-h-[200px]">
                    {menus.filter(m => m.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).map(menuItem => (
                      <div key={menuItem.id} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                        <div>
                          <p className="font-bold text-sm leading-none mb-1">{menuItem.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{menuItem.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {newOrderItems.find((item: any) => item.id === menuItem.id)?.qty > 0 && (
                            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                              {newOrderItems.find((item: any) => item.id === menuItem.id)?.qty}x
                            </span>
                          )}
                          <Button 
                            onClick={() => handleAddItem(menuItem)}
                            size="sm" variant="outline" className="h-8 w-8 rounded-full p-0 flex items-center justify-center border-primary/20 text-primary hover:bg-primary hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {menus.filter(m => m.name.toLowerCase().includes(menuSearchQuery.toLowerCase())).length === 0 && (
                      <div className="text-center py-4 text-xs text-muted-foreground">No menu matches "{menuSearchQuery}"</div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-muted-foreground">Items:</span>
                      <span className="text-sm font-bold">{newOrderItems.reduce((acc: number, item: any) => acc + item.qty, 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-xl text-primary">Rp {newOrderItems.reduce((acc: number, item: any) => acc + (parseInt(item.price.replace(/\D/g, '')) * item.qty), 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-muted/20">
                <Button variant="outline" onClick={() => setIsNewOrderModalOpen(false)} className="rounded-full px-6">Cancel</Button>
                <Button onClick={handleCreateOrder} disabled={!customerName || newOrderItems.length === 0} className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Create Order</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
