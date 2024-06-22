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
          // Delete existing line items and recreate
          // The tradeoff here is between keeping the code very simple and avoiding unneccessry delete operations 
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
}
