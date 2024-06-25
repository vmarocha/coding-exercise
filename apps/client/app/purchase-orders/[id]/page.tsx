import { PurchaseOrder } from '../../interfaces';
import PurchaseOrderForm from "../../components/PurchaseOrderForm";
import { fetchParentItems } from '../../utils/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const res = await fetch(`${API_BASE_URL}/purchase-orders/${id}`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error('Failed to fetch purchase order');
  }
  return res.json();
};

interface EditPurchaseOrderPageProps {
  params: {
    id: string;
  };
}

const EditPurchaseOrderPage = async ({ params }: EditPurchaseOrderPageProps) => {
  const purchaseOrder = await fetchPurchaseOrder(params.id);
  const items = await fetchParentItems();

  return (
    <div>
      <h1 className="text-2xl">Edit Purchase Order</h1>
      <PurchaseOrderForm purchaseOrder={purchaseOrder} items={items} mode="edit" />
    </div>
  );
};

export default EditPurchaseOrderPage;