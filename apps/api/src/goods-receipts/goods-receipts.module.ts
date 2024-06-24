import { Module } from '@nestjs/common';
import { GoodsReceiptsService } from './goods-receipts.service';
import { GoodsReceiptsController } from './goods-receipts.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [GoodsReceiptsController],
  providers: [GoodsReceiptsService, PrismaService],
})
export class GoodsReceiptsModule {}
