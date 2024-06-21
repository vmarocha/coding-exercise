import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PurchaseOrders } from "@prisma/client";
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { PrismaService } from "../prisma.service";

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {
  }

  // The naming convention here seems inconsistent. In prisma, PurchaseOrders is plural while ParentItem is singular
  async findAll(): Promise<PurchaseOrders[]> {

    const purchaseOrders = await this.prisma.purchaseOrders.findMany({
      include: {
        purchase_order_line_items: true,
      },

      // Sort by expected delivery date based on requirements
      orderBy: {
        expected_delivery_date: 'asc', 
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
        order_date: new Date(createPurchaseOrderDto.order_date),
        expected_delivery_date: new Date(createPurchaseOrderDto.expected_delivery_date),
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
        order_date: updatePurchaseOrderDto.order_date ? new Date(updatePurchaseOrderDto.order_date) : undefined,
        expected_delivery_date: updatePurchaseOrderDto.expected_delivery_date ? new Date(updatePurchaseOrderDto.expected_delivery_date) : undefined,
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
        purchase_order_line_items: true, // Include related line items if necessary
      },
    });

    if (!purchaseOrder) {
      throw new NotFoundException(`Purchase Order with ID ${id} not found`);
    }

    return purchaseOrder;
  }
}
