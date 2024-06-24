// Moved interfaces here to avoid code replication

export interface Item {
    id: number;
    name: string;
    sku: string;
}

export interface ParentItem {
    id: number;
    name: string;
    items: Item[];
}

export interface PurchaseOrder {
    id: number;
    vendor_name: string;
    // Decided to define the dates here as strings to avoid unnecessary back and forth conversion from Date to string since the UI needs it to be a string for display and editing purposes
    order_date: string;
    expected_delivery_date: string;
    purchase_order_line_items: PurchaseOrderLineItem[];
    total_quantity: number;
    total_cost: number;

    good_receipts: GoodsReceipt[]
    supplier_invoices: SupplierInvoice[]
}

export interface PurchaseOrderLineItem {
    id: number;
    item_id: number;
    quantity: number;
    unit_cost: number;
}

export interface GoodsReceipt {
    id: number;
    purchase_order_id: number;
    received_date: string;
    line_items: GoodsReceiptLineItem[];
}

export interface GoodsReceiptLineItem {
    id: number;
    item_id: number;
    quantity_received: number;
}

export interface SupplierInvoice {
    id: number;
    purchase_order_id: number;
    invoice_date: string;
    line_items: SupplierInvoiceLineItem[];
}

export interface SupplierInvoiceLineItem {
    id: number;
    item_id: number;
    quantity_invoiced: number;
    unit_cost: number;
}