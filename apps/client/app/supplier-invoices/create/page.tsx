import SupplierInvoiceForm from '../../components/SupplierInvoiceForm';
import { fetchParentItems, fetchPurchaseOrders } from '../../utils/api';
import { Mode } from '../../utils/enums';

export default async function CreateSupplierInvoicePage() {
  const items = await fetchParentItems();
  const purchaseOrders = await fetchPurchaseOrders();

  return (
    <div>
      <h1 className="text-2xl mb-4">Create Supplier Invoice</h1>
      <SupplierInvoiceForm items={items} purchaseOrders={purchaseOrders} mode={Mode.CREATE} />
    </div>
  );
}