import React from 'react';
import Link from 'next/link';
import { GoodsReceipt } from '../interfaces';

const fetchGoodsReceipts = async (): Promise<GoodsReceipt[]> => {
  const res = await fetch('http://localhost:3100/api/goods-receipts', { cache: 'no-cache' });
  return res.json();
};

const GoodsReceiptsPage = async () => {
  const goodsReceipts = await fetchGoodsReceipts();

  return (
    <div className="container mx-auto p-4 bg-base-100 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-accent-content">Goods Receipts</h1>
      <table className="table-auto w-full bg-base-100 text-sm rounded-lg shadow-md">
        <thead>
          <tr className="bg-accent-content text-base-100">
            <th className="p-4 text-left">Goods Receipt Number</th>
            <th className="p-4 text-left">Purchase Order ID</th>
            <th className="p-4 text-left">Received Date</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {goodsReceipts.map((receipt) => (
            <tr key={receipt.id} className="border-b border-accent">
              <td className="p-4 text-accent-content">{receipt.id}</td>
              <td className="p-4 text-accent-content">{receipt.purchase_order_id}</td>
              <td className="p-4 text-accent-content">{receipt.received_date.substring(0, 10)}</td>
              <td className="p-4">
                <Link href={`/goods-receipts/${receipt.id}`} className="text-blue-500 hover:underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/goods-receipts/create" className="inline-block mt-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700">Create New Goods Receipt</Link>
    </div>
  );
};

export default GoodsReceiptsPage;
