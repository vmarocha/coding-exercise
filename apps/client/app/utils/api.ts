import { Item, PurchaseOrder } from "../interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchParentItems = async (): Promise<Item[]> => {
  const res = await fetch(`${API_BASE_URL}/parent-items`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch parent items');
  }
  const data = await res.json();
  return data.flatMap((parent: { items: Item[] }) => parent.items);
};

export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await fetch(`${API_BASE_URL}/purchase-orders`, {
    cache: 'no-cache',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch purchase orders');
  }
  return res.json();
};
