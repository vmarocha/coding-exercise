import { PurchaseOrder } from '../interfaces';
import Link from 'next/link';

const fetchPurchaseOrders = async (sortField: string, sortOrder: string): Promise<PurchaseOrder[]> => {
  const res = await fetch(`http://localhost:3100/api/purchase-orders?sortField=${sortField}&sortOrder=${sortOrder}`, { cache: 'no-cache' });
  return res.json();
};

const PurchaseOrdersPage = async ({ searchParams }: { searchParams: { sortField?: string, sortOrder?: string } }) => {
  // Implementing server side sorting to keep the code clean and since there aren't a lot of records, the performance hit is not noticable.
  // Client side sorting would definitely be better if we expect to be handling larger datasets
  const sortField = searchParams.sortField || 'expected_delivery_date';
  const sortOrder = searchParams.sortOrder || 'asc';

  const purchaseOrders = await fetchPurchaseOrders(sortField, sortOrder);

  const getSortOrder = (field: string) => {
    return field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
  };

  return (
    <div className="container mx-auto p-4 bg-base-100 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-accent-content">Purchase Orders</h1>
      <table className="table-auto w-full bg-base-100 text-sm rounded-lg shadow-md">
        <thead>
          <tr className="bg-accent-content text-base-100">
          <th className="p-4 text-left">
              <Link href={`/purchase-orders?sortField=id&sortOrder=${getSortOrder('id')}`} className="cursor-pointer">Purchase Order Number</Link>
            </th>
            <th className="p-4 text-left">
              <Link href={`/purchase-orders?sortField=vendor_name&sortOrder=${getSortOrder('vendor_name')}`} className="cursor-pointer">Vendor Name</Link>
            </th>
            <th className="p-4 text-left">
              <Link href={`/purchase-orders?sortField=expected_delivery_date&sortOrder=${getSortOrder('expected_delivery_date')}`} className="cursor-pointer">Delivery Date</Link>
            </th>
            <th className="p-4 text-left">
              <Link href={`/purchase-orders?sortField=order_date&sortOrder=${getSortOrder('order_date')}`} className="cursor-pointer">Order Date</Link>
            </th>
            <th className="p-4 text-left">Total Quantity</th>
            <th className="p-4 text-left">Total Cost of Goods</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((purchaseOrder) => (
            <tr key={purchaseOrder.id} className="border-b border-accent">
              <td className="p-4 text-accent-content">{purchaseOrder.id}</td>
              <td className="p-4 text-accent-content">{purchaseOrder.vendor_name}</td>
              <td className="p-4 text-accent-content">{purchaseOrder.expected_delivery_date.substring(0, 10)}</td>
              <td className="p-4 text-accent-content">{purchaseOrder.order_date.substring(0, 10)}</td>
              <td className="p-4 text-accent-content">{purchaseOrder.total_quantity}</td>
              <td className="p-4 text-accent-content">{purchaseOrder.total_cost}</td>
              <td className="p-4">
                <Link href={`/purchase-orders/${purchaseOrder.id}`} className="text-blue-500 hover:underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/purchase-orders/create" className="inline-block mt-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700">Create New Purchase Order</Link>
    </div>
  );
};

export default PurchaseOrdersPage;