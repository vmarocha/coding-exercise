import { Injectable } from '@nestjs/common';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';
import { PrismaService } from '../prisma.service';
import { SupplierInvoice } from '@prisma/client';

@Injectable()
export class SupplierInvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSupplierInvoiceDto: CreateSupplierInvoiceDto) {
    return this.prisma.supplierInvoice.create({
      data: {
        purchase_order_id: createSupplierInvoiceDto.purchase_order_id,
        invoice_date: createSupplierInvoiceDto.invoice_date,
        line_items: {
          create: createSupplierInvoiceDto.line_items.map(item => ({
            item_id: item.item_id,
            quantity_invoiced: item.quantity_invoiced,
            unit_cost: item.unit_cost
          }))
        },
      },
    });
  }

  async findAll(): Promise<SupplierInvoice[]> {
    return this.prisma.supplierInvoice.findMany({
      include: {
        purchase_order: true,
        line_items: true,
      },
    });
  }

  async findOne(id: number): Promise<SupplierInvoice> {
    return this.prisma.supplierInvoice.findUnique({
      where: { id },
      include: {
        line_items: true,
      },
    });
  }

  async update(id: number, updateSupplierInvoiceDto: UpdateSupplierInvoiceDto): Promise<SupplierInvoice> {
    // Extracting item IDs from the DTO
    const updatedLineItemIds = updateSupplierInvoiceDto.line_items.map(line_item => line_item.id);

    // Step 1: Delete line items not present in the DTO
    await this.prisma.supplierInvoiceLineItem.deleteMany({
      where: {
        supplier_invoice_id: id,
        id: { notIn: updatedLineItemIds },
      },
    });

    // Step 2: Upsert line items
    return this.prisma.supplierInvoice.update({
      where: { id },
      data: {
        purchase_order: {
          connect: { id: updateSupplierInvoiceDto.purchase_order_id },
        },
        invoice_date: updateSupplierInvoiceDto.invoice_date,
        line_items: {
          upsert: updateSupplierInvoiceDto.line_items.map(line_item => ({
            where: { id: line_item.id },
            update: { item_id: line_item.item_id, quantity_invoiced: line_item.quantity_invoiced, unit_cost: line_item.unit_cost },
            create: { item_id: line_item.item_id, quantity_invoiced: line_item.quantity_invoiced, unit_cost: line_item.unit_cost },
          })),
        },
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} supplierInvoice`;
  }
}
