import { SummaryCard } from './components/SummaryCard';
import { PurchaseOrder } from '../interfaces';

const fetchMatches = async (): Promise<PurchaseOrder[]> => {
  const res = await fetch('http://localhost:3100/api/purchase-orders/matches', { cache: 'no-cache' });
  return res.json();
};

const fetchAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const res = await fetch('http://localhost:3100/api/purchase-orders', { cache: 'no-cache' });
  return res.json();
};

const Dashboard = async () => {
  const matches: PurchaseOrder[] = await fetchMatches();
  const allPurchaseOrders: PurchaseOrder[] = await fetchAllPurchaseOrders();

  const matchedPurchaseOrders = matches.filter(
    match => match.good_receipts?.length > 0 && match.supplier_invoices?.length > 0
  );

  const totalPurchaseOrders = allPurchaseOrders.length;
  const totalGoodsReceipts = allPurchaseOrders.reduce((acc, order) => acc + (order.good_receipts?.length || 0), 0);
  const totalSupplierInvoices = allPurchaseOrders.reduce((acc, order) => acc + (order.supplier_invoices?.length || 0), 0);

  const matchedGoodsReceipts = matches.reduce((acc, match) => acc + (match.good_receipts?.length || 0), 0);
  const matchedSupplierInvoices = matches.reduce((acc, match) => acc + (match.supplier_invoices?.length || 0), 0);

  return (
    <div className="container mx-auto p-4 bg-base-100 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-accent-content">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Purchase Orders"
          count={totalPurchaseOrders}
          details={`${matchedPurchaseOrders.length} matched`}
        />
        <SummaryCard
          title="Total Goods Receipts"
          count={totalGoodsReceipts}
          details={`${matchedGoodsReceipts} matched`}
        />
        <SummaryCard
          title="Total Supplier Invoices"
          count={totalSupplierInvoices}
          details={`${matchedSupplierInvoices} matched`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
