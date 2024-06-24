import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { GoodsReceiptsService } from './goods-receipts.service';
import { CreateGoodsReceiptDto } from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';

@Controller('goods-receipts')
export class GoodsReceiptsController {
  constructor(private readonly goodsReceiptsService: GoodsReceiptsService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  create(@Body() createGoodsReceiptDto: CreateGoodsReceiptDto) {
    return this.goodsReceiptsService.create(createGoodsReceiptDto);
  }

  @Get()
  findAll() {
    return this.goodsReceiptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsReceiptsService.findOne(+id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoodsReceiptDto: UpdateGoodsReceiptDto
  ) {
    return this.goodsReceiptsService.update(+id, updateGoodsReceiptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsReceiptsService.remove(+id);
  }
}