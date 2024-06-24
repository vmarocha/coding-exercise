import { Item, PurchaseOrder } from "../interfaces";

export const fetchParentItems = async (): Promise<Item[]> => {
  const res = await fetch('http://localhost:3100/api/parent-items', {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch parent items');
  }
  const data = await res.json();
  return data.flatMap((parent: { items: Item[] }) => parent.items);
};

export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await fetch('http://localhost:3100/api/purchase-orders', {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch purchase orders');
  }
  return res.json();
};
