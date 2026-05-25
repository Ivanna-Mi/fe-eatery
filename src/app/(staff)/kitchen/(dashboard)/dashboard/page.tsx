"use client";

import * as React from "react";
import { useStaffStore } from "@/store/useStaffStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChefHat, Flame, CheckCircle, Clock } from "lucide-react";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function KitchenDashboard() {
  const { orders } = useStaffStore();

  const newOrders = orders.filter(o => o.status === 'confirmed').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const readyOrders = orders.filter(o => o.status === 'ready').length;
  const completedToday = orders.filter(o => o.status === 'completed' || o.status === 'served').length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-serif font-bold">Kitchen Overview</h2>
        <p className="text-muted-foreground">Current kitchen load and performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="New Tickets" value={newOrders} icon={ChefHat} iconColorClass="text-blue-500" iconBgClass="bg-blue-500/10" />
        <AnalyticsCard title="Currently Cooking" value={preparingOrders} icon={Flame} iconColorClass="text-orange-500" iconBgClass="bg-orange-500/10" />
        <AnalyticsCard title="Ready for Pickup" value={readyOrders} icon={CheckCircle} iconColorClass="text-green-500" iconBgClass="bg-green-500/10" />
        <AnalyticsCard title="Avg. Prep Time" value="12m" icon={Clock} iconColorClass="text-gray-500" iconBgClass="bg-gray-500/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-card border-none shadow-sm rounded-2xl p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <Flame className="w-16 h-16 text-orange-500 opacity-50" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Cooking Queue</h3>
            <p className="text-muted-foreground mb-6">Manage incoming orders and start preparing food.</p>
            <Link href="/kitchen/queue">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full max-w-xs text-lg h-14 rounded-xl">
                Open Display Screen
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card border-none shadow-sm rounded-2xl p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]">
          <CheckCircle className="w-16 h-16 text-green-500 opacity-50" />
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready Orders</h3>
            <p className="text-muted-foreground mb-6">Track orders that are waiting to be served.</p>
            <Link href="/kitchen/ready-orders">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white w-full max-w-xs text-lg h-14 rounded-xl">
                View Ready Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
