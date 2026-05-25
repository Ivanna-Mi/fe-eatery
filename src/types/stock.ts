export type StockCategory = "Ingredients" | "Packaging" | "Supplies" | "Beverages";
export type StockStatus = "Good" | "Low" | "Out of Stock";

export interface StockItem {
  id: string;
  name: string;
  category: StockCategory | string;
  quantity: string; // e.g., "2.5 kg" or "50 pcs"
  status: StockStatus | string;
  lastUpdated: string;
}
