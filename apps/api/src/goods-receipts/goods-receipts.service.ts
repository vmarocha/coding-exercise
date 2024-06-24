import { Injectable } from '@nestjs/common';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { PrismaService } from "../prisma.service";
import { GoodsReceipt } from '@prisma/client';

@Injectable()
export class GoodsReceiptsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGoodsReceiptDto: CreateGoodsReceiptDto) {
    return this.prisma.goodsReceipt.create({
      data: {
        purchase_order_id: createGoodsReceiptDto.purchase_order_id,
        received_date: createGoodsReceiptDto.received_date,
        line_items: {
          create: createGoodsReceiptDto.line_items.map(item => ({
            item_id: item.item_id,
            quantity_received: item.quantity_received
          }))
        },
      },
    });
  }

  async findAll(): Promise<GoodsReceipt[]> {
    return this.prisma.goodsReceipt.findMany({
      include: {
        purchase_order: true,
        line_items:true
      },
    });
  }

  async findOne(id: number): Promise<GoodsReceipt> {
    return this.prisma.goodsReceipt.findUnique({
      where: { id },
      include: {
        line_items: true,
      },
    });
  }

  async update(id: number, updateGoodsReceiptDto: UpdateGoodsReceiptDto): Promise<GoodsReceipt> {
    // Extracting item IDs from the DTO
    const updatedLineItemIds = updateGoodsReceiptDto.line_items.map(line_item => line_item.id);

    // Step 1: Delete line items not present in the DTO
    await this.prisma.goodsReceiptLineItem.deleteMany({
      where: {
        goods_receipt_id: id,
        id: { notIn: updatedLineItemIds },
      },
    });

    // Step 2: Upsert line items
    return this.prisma.goodsReceipt.update({
      where: { id },
      data: {
        purchase_order: {
          connect: { id: updateGoodsReceiptDto.purchase_order_id },
        },
        received_date: updateGoodsReceiptDto.received_date,
        line_items: {
          upsert: updateGoodsReceiptDto.line_items.map(line_item => ({
            where: { id: line_item.id },
            update: { item_id: line_item.item_id, quantity_received: line_item.quantity_received },
            create: { item_id: line_item.item_id, quantity_received: line_item.quantity_received },
          })),
        },
      },
    });
    
  }
}
