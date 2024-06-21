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
    order_date: string;
    expected_delivery_date: string;
    purchase_order_line_items: PurchaseOrderLineItem[];
    total_quantity: number;
    total_cost: number;
}

export interface PurchaseOrderLineItem {
    id: number;
    item_id: number;
    quantity: number;
    unit_cost: number;
}