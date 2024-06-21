import { PurchaseOrder } from '../interfaces';
import Link from 'next/link';

const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await fetch('http://localhost:3100/api/purchase-orders', { cache: 'no-cache' });
  return res.json();
};

const PurchaseOrdersPage = async () => {
  const purchaseOrders = await fetchPurchaseOrders();

  return (
    <div>
      <h1 className="text-2xl">Purchase Orders</h1>
      <table className="border-collapse table-auto w-full text-sm">
        <thead>
          <tr>
          <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
              Purchase Order Number
            </th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
              Vendor Name
            </th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
              Delivery Date
            </th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
              Order Date
            </th>
            <th className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800">
          {purchaseOrders.map((purchaseOrder) => (
            <tr key={purchaseOrder.id}>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {purchaseOrder.id}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {purchaseOrder.vendor_name}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {new Date(purchaseOrder.expected_delivery_date).toLocaleDateString()}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                {new Date(purchaseOrder.order_date).toLocaleDateString()}
              </td>
              <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                <Link href={`/purchase-orders/${purchaseOrder.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/purchase-orders/create">Create New Purchase Order</Link>
    </div>
  );
};

export default PurchaseOrdersPage;