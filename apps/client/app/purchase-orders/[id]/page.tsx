import { PurchaseOrder } from '../../interfaces';
import PurchaseOrderForm from "../../components/PurchaseOrderForm";

const fetchPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  const res = await fetch(`http://localhost:3100/api/purchase-orders/${id}`, { cache: 'no-cache' });
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

  return (
    <div>
      <h1 className="text-2xl">Edit Purchase Order</h1>
      <PurchaseOrderForm purchaseOrder={purchaseOrder} mode="edit" />
    </div>
  );
};

export default EditPurchaseOrderPage;