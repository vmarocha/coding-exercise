import { Module } from '@nestjs/common';
import { SupplierInvoicesService } from './supplier-invoices.service';
import { SupplierInvoicesController } from './supplier-invoices.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SupplierInvoicesController],
  providers: [SupplierInvoicesService, PrismaService],
})
export class SupplierInvoicesModule {}
