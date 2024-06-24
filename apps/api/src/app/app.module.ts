import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParentItemsModule } from '../parent-items/parent-items.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { GoodsReceiptsModule } from '../goods-receipts/goods-receipts.module';
import { SupplierInvoicesModule } from '../supplier-invoices/supplier-invoices.module';
import { ThreeWayMatchModule } from '../three-way-match/three-way-match.module';

@Module({
  imports: [
    ParentItemsModule,
    PurchaseOrdersModule,
    GoodsReceiptsModule,
    SupplierInvoicesModule,
    ThreeWayMatchModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
