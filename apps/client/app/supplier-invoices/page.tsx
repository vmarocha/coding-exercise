import React from 'react';
import { SupplierInvoice } from '../interfaces';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchSupplierInvoices = async (): Promise<SupplierInvoice[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/supplier-invoices`, { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error('Failed to fetch supplier invoices');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching supplier invoices:', error);
    return [];
  }
};

const SupplierInvoicesPage = async () => {
  const supplierInvoices = await fetchSupplierInvoices();

  return (
    <div className="container mx-auto p-4 bg-base-100 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-accent-content">Supplier Invoices</h1>
      <table className="table-auto w-full bg-base-100 text-sm rounded-lg shadow-md">
        <thead>
          <tr className="bg-accent-content text-base-100">
            <th className="p-4 text-left">Invoice Number</th>
            <th className="p-4 text-left">Purchase Order ID</th>
            <th className="p-4 text-left">Invoice Date</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {supplierInvoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-accent">
              <td className="p-4 text-accent-content">{invoice.id}</td>
              <td className="p-4 text-accent-content">{invoice.purchase_order_id}</td>
              <td className="p-4 text-accent-content">{invoice.invoice_date.substring(0, 10)}</td>
              <td className="p-4">
                <Link href={`/supplier-invoices/${invoice.id}`} className="text-blue-500 hover:underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/supplier-invoices/create" className="inline-block mt-4 py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700">Create New Supplier Invoice</Link>
    </div>
  );
};

export default SupplierInvoicesPage;
