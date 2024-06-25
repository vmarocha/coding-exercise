import './global.css';
import { ReactNode } from 'react';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export const metadata = {
  title: 'GoodDay Software Coding Exercise',
  description: 'Thank you for your time!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <div className="container mx-auto">
          <div className="navbar bg-base-100 bg-accent-content/5 mt-2 mb-4 rounded-md">
            <Link href="/purchase-orders" className="btn btn-ghost normal-case">Purchase Orders</Link>
            <Link href="/goods-receipts" className="btn btn-ghost normal-case">Goods Receipts</Link>
            <Link href="/supplier-invoices" className="btn btn-ghost normal-case">Supplier Invoices</Link>
            <Link href="/parent-items" className="btn btn-ghost normal-case">Item Catalog</Link>
          </div>
          <main className="mx-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
