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
        good_receipts: true,
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
    return this.prisma.purchaseOrders.update({
      where: { id },
      data: {
        vendor_name: updatePurchaseOrderDto.vendor_name,
        order_date: updatePurchaseOrderDto.order_date,
        expected_delivery_date: updatePurchaseOrderDto.expected_delivery_date,
        purchase_order_line_items: {
          deleteMany: {
            purchase_order_id: id,
          },
          create: updatePurchaseOrderDto.purchase_order_line_items.map(item => ({
            item_id: item.item_id,
            quantity: item.quantity,
            unit_cost: item.unit_cost,
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

  // 3 way matching of Purchase Orders, Goods Receipts, and Supplier invoices
  async findMatches(): Promise<PurchaseOrders[]> {
    const purchaseOrders = await this.prisma.purchaseOrders.findMany({
      include: {
        purchase_order_line_items: true,
        good_receipts: {
          include: {
            line_items: true,
          },
        },
        supplier_invoices: {
          include: {
            line_items: true,
          },
        },
      },
    });

    return purchaseOrders.filter(order => {
      const poItems = order.purchase_order_line_items;

      const grItems = order.good_receipts.flatMap(receipt => receipt.line_items);
      const siItems = order.supplier_invoices.flatMap(invoice => invoice.line_items);

      const poItemsMap = new Map(poItems.map(item => [item.item_id, item]));
      const grItemsMap = new Map(grItems.map(item => [item.item_id, item]));
      const siItemsMap = new Map(siItems.map(item => [item.item_id, item]));

      for (const [itemId, poItem] of poItemsMap) {
        const grItem = grItemsMap.get(itemId);
        const siItem = siItemsMap.get(itemId);

        // If there is no goods receipt line item or supplier invoice line item for the purchase order line item then match fails
        if (!grItem || !siItem) {
          return false;
        }

        // If the quantities don't match then match fails
        if (poItem.quantity !== grItem.quantity_received || poItem.quantity !== siItem.quantity_invoiced) {
          return false;
        }

        // If the costs of the individual items don't match then match fails
        if (Number(poItem.unit_cost) !== Number(siItem.unit_cost)) {
          return false;
        }
      }

      return true;
    });
  }
}
