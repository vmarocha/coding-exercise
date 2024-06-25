import GoodsReceiptForm from '../../components/GoodsReceiptForm';
import { fetchParentItems, fetchPurchaseOrders } from '../../utils/api';
import { Mode } from '../../utils/enums';

export default async function CreateGoodsReceiptPage() {
  const items = await fetchParentItems();
  const purchaseOrders = await fetchPurchaseOrders();

  return (
    <div>
      <h1 className="text-2xl mb-4">Create Goods Receipt</h1>
      <GoodsReceiptForm items={items} purchaseOrders={purchaseOrders} mode={Mode.CREATE} />
    </div>
  );
}
