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
          create: createGoodsReceiptDto.line_items,
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
    return this.prisma.goodsReceipt.update({
      where: { id },
      data: {
        purchase_order_id: updateGoodsReceiptDto.purchase_order_id,
        received_date: updateGoodsReceiptDto.received_date,
        line_items: {
          // Delete existing line items and recreate
          deleteMany: {
            goods_receipt_id: id,
          },
          create: updateGoodsReceiptDto.line_items.map(item => ({
            item_id: item.item_id,
            quantity_received: item.quantity_received,
          })),
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} goodsReceipt`;
  }
}
