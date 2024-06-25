// app/supplier-invoices/[id]/page.tsx
import SupplierInvoiceForm from '../../components/SupplierInvoiceForm';
import { fetchParentItems, fetchPurchaseOrders } from '../../utils/api';
import { SupplierInvoice } from '../../interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchSupplierInvoice = async (id: string): Promise<SupplierInvoice> => {
  const res = await fetch(`${API_BASE_URL}/supplier-invoices/${id}`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error('Failed to fetch supplier invoice');
  }
  return res.json();
};

interface EditSupplierInvoicePageProps {
  params: { id: string };
}

export default async function EditSupplierInvoicePage({ params }: EditSupplierInvoicePageProps) {
  const supplierInvoice = await fetchSupplierInvoice(params.id);
  const items = await fetchParentItems();
  const purchaseOrders = await fetchPurchaseOrders();

  return (
    <div>
      <h1 className="text-2xl mb-4">Edit Supplier Invoice</h1>
      <SupplierInvoiceForm supplierInvoice={supplierInvoice} items={items} purchaseOrders={purchaseOrders} mode="edit" />
    </div>
  );
}
