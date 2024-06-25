import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PurchaseOrders } from "@prisma/client";
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {
  }

  // Just a note that the naming convention here seems inconsistent. In prisma, PurchaseOrders is plural while ParentItem is singular
  async findAll(sortField: string, sortOrder: string): Promise<PurchaseOrders[]> {

    const purchaseOrders = await this.prisma.purchaseOrders.findMany({
      /* 
        There is a problem here that should be noted between Prisma and SQLite specifically for dates. Prisma maps DateTime fields to a numeric in SQLite. 
        The seed data stored the dates in ISO format but when creating or update records, it will be stored as an integer which will make it seem like the sort is broken. 
        For more info, see: https://github.com/prisma/prisma/issues/8510
      */
      orderBy: {
        [sortField]: sortOrder,
      },
      include: {
        purchase_order_line_items: true,
        goods_receipts: true,
        supplier_invoices: true,
      },
    });

    return purchaseOrders.map(order => ({
      ...order,
      total_quantity: order.purchase_order_line_items.reduce((sum, item) => sum + item.quantity, 0),
      total_cost: order.purchase_order_line_items.reduce((sum, item) => sum + item.quantity * Number(item.unit_cost), 0),
    }));
  }
  
  async create(createPurchaseOrderDto: CreatePurchaseOrderDto): Promise<PurchaseOrders> {
    return this.prisma.purchaseOrders.create({
      data: {
        vendor_name: createPurchaseOrderDto.vendor_name,
        order_date: createPurchaseOrderDto.order_date,
        expected_delivery_date: createPurchaseOrderDto.expected_delivery_date,
        purchase_order_line_items: {
          create: createPurchaseOrderDto.purchase_order_line_items.map(item => ({
            item_id: item.item_id,
            quantity: item.quantity,
            unit_cost: item.unit_cost,
          })),
        },
      },
    });
  }

  async update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto): Promise<PurchaseOrders> {    
    // Extracting item IDs from the DTO
    const updatedLineItemIds = updatePurchaseOrderDto.purchase_order_line_items.map(line_item => line_item.id);

    // Step 1: Delete line items not present in the DTO
    await this.prisma.purchaseOrderLineItems.deleteMany({
      where: {
        purchase_order_id: id,
        id: { notIn: updatedLineItemIds },
      },
    });

    // Step 2: Upsert line items
    return this.prisma.purchaseOrders.update({
      where: { id },
      data: {
        vendor_name: updatePurchaseOrderDto.vendor_name,
        order_date: updatePurchaseOrderDto.order_date,
        expected_delivery_date: updatePurchaseOrderDto.expected_delivery_date,
        purchase_order_line_items: {
          upsert: updatePurchaseOrderDto.purchase_order_line_items.map(line_item => ({
            where: { id: line_item.id },
            update: { item_id: line_item.item_id, quantity: line_item.quantity, unit_cost: line_item.unit_cost },
            create: { item_id: line_item.item_id, quantity: line_item.quantity, unit_cost: line_item.unit_cost },
          })),
        },
      },
    });
  }

  async findOne(id: number): Promise<PurchaseOrders> {
    const purchaseOrder = this.prisma.purchaseOrders.findUnique({
      where: { id },
      include: {
        purchase_order_line_items: true, // Include related line items
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return purchaseOrder;
  }

  /* 
  A 3-way match occurs if the following are true:
  1. Each item that is present in the purchase order is also present in the goods receipt and supplier invoice 
  2. The total quantities of each item in the purchase order match the total quantities for that same item in the goods receipt and supplier invoice
  3. The total cost of each item in the purchase order match the total cost for that same item in the supplier invoice  
  */
  async findMatches(): Promise<{ id: number, goodsReceiptMatch: boolean, supplierInvoiceMatch: boolean, reasons: string[] }[]> {
    
    // Step 1: Get relevant records from the database
    const purchaseOrders = await this.prisma.purchaseOrders.findMany({
      include: {
        purchase_order_line_items: {
          include: {
            item: true
          }
        }
      },
    });

    const grItems = await this.prisma.goodsReceiptLineItem.findMany({
      include: { goods_receipt: true },
    });
    const siItems = await this.prisma.supplierInvoiceLineItem.findMany({
      include: { supplier_invoice: true },
    });

    const matches = [];

    // Step 2: Loop through each purchase order to determine if it has any good receipts or supplier invoices
    for (const po of purchaseOrders) {
      let goodsReceiptMatch = true;
      let supplierInvoiceMatch = true;
      let bypassGoodReceiptErrors = false;
      let bypassSupplierInvoiceErrors = false;

      const reasons = [];

      const hasGoodsReceipts = grItems.some(gr => gr.goods_receipt.purchase_order_id === po.id);
      const hasSupplierInvoices = siItems.some(si => si.supplier_invoice.purchase_order_id === po.id);

      if (!hasGoodsReceipts) {
        goodsReceiptMatch = false;
        bypassGoodReceiptErrors = true
        reasons.push(`No goods receipts for purchase order ${po.id}`);
      }

      if (!hasSupplierInvoices) {
        supplierInvoiceMatch = false;
        bypassSupplierInvoiceErrors = true
        reasons.push(`No supplier invoices for purchase order ${po.id}`);
      }

      // Step 3: If either good receipts or supplier invoices exist, loop through each purchase order line item and see if the line item details match the goods receipt or supplier invoice details
      if (goodsReceiptMatch || supplierInvoiceMatch) {
        for (const poItem of po.purchase_order_line_items) {
          const relatedGRItems = grItems.filter(gr => gr.item_id === poItem.item_id && gr.goods_receipt.purchase_order_id === po.id);
          const relatedSIItems = siItems.filter(si => si.item_id === poItem.item_id && si.supplier_invoice.purchase_order_id === po.id);

          const grTotalQuantity = relatedGRItems.reduce((sum, item) => sum + item.quantity_received, 0);
          const siTotalQuantity = relatedSIItems.reduce((sum, item) => sum + item.quantity_invoiced, 0);
          const siTotalCost = relatedSIItems.reduce((sum, item) => sum + (item.quantity_invoiced * Number(item.unit_cost)), 0);
          const poTotalCost = poItem.quantity * Number(poItem.unit_cost);

          // If no Good Receipt exists for the purchase order, no need to add additional reasons for the mismatch
          if (!bypassGoodReceiptErrors) {
            if (relatedGRItems.length === 0) {
              goodsReceiptMatch = false;
              reasons.push(`Goods receipt for item ${poItem.item.name} does not exist`);
            } else if (poItem.quantity !== grTotalQuantity) {
              goodsReceiptMatch = false;
              reasons.push(`Goods receipt quantities for item ${poItem.item.name} don't match`);
            }
          }

          // If no Supplier Invoice exists for the purchase order, no need to add additional reasons for the mismatch
          if (!bypassSupplierInvoiceErrors) {
            if (relatedSIItems.length === 0) {
              supplierInvoiceMatch = false;
              reasons.push(`Supplier invoice for item ${poItem.item.name} does not exist`);
            } else if (poItem.quantity !== siTotalQuantity) {
              supplierInvoiceMatch = false;
              reasons.push(`Supplier invoice quantities for item ${poItem.item.name} don't match`);
            } else if (poTotalCost !== siTotalCost) {
              supplierInvoiceMatch = false;
              reasons.push(`Supplier invoice costs for item ${poItem.item.name} don't match`);
            }
          }
        }
        
      }

      // Step 4: If all checks pass, it is a 3-way match!
      matches.push({
        id: po.id,
        goodsReceiptMatch,
        supplierInvoiceMatch,
        reasons
      });
    }

    return matches;
  }
}
