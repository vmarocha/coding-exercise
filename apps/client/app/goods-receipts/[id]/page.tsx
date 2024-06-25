// app/goods-receipts/[id]/page.tsx
import GoodsReceiptForm from '../../components/GoodsReceiptForm';
import { fetchParentItems, fetchPurchaseOrders } from '../../utils/api';
import { GoodsReceipt } from '../../interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchGoodsReceipt = async (id: string): Promise<GoodsReceipt> => {
  const res = await fetch(`${API_BASE_URL}/goods-receipts/${id}`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error('Failed to fetch goods receipt');
  }
  return res.json();
};

interface EditGoodsReceiptPageProps {
  params: { id: string };
}

export default async function EditGoodsReceiptPage({ params }: EditGoodsReceiptPageProps) {
  const goodsReceipt = await fetchGoodsReceipt(params.id);
  const items = await fetchParentItems();
  const purchaseOrders = await fetchPurchaseOrders();

  return (
    <div>
      <h1 className="text-2xl mb-4">Edit Goods Receipt</h1>
      <GoodsReceiptForm goodsReceipt={goodsReceipt} items={items} purchaseOrders={purchaseOrders} mode="edit" />
    </div>
  );
}
