"use client";

import { usePOSStore } from "@/store/usePOSStore";
import { OrderTypeSelector } from "@/components/staff/cashier/pos/OrderTypeSelector";
import { TableSelector } from "@/components/staff/cashier/pos/TableSelector";
import { CustomerInfoForm } from "@/components/staff/cashier/pos/CustomerInfoForm";
import { POSMenu } from "@/components/staff/cashier/pos/POSMenu";

export default function NewOrderPage() {
  const { orderType, selectedTable, customerInfo } = usePOSStore();

  // Step 1: Select Order Type
  if (!orderType) {
    return <OrderTypeSelector />;
  }

  // Step 2: Select Details based on Type
  if (orderType === "dine-in" && !selectedTable) {
    return <TableSelector />;
  }

  if (orderType === "takeaway" && !customerInfo) {
    return <CustomerInfoForm />;
  }

  // Step 3: POS Menu & Cart
  return <POSMenu />;
}
