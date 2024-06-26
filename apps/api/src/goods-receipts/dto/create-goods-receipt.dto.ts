import {
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class GoodsReceiptLineItemDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  item_id: number;

  @IsNotEmpty()
  @IsNumber()
  quantity_received: number;
}

export class CreateGoodsReceiptDto {
  @IsNotEmpty()
  @IsNumber()
  purchase_order_id: number;

  @Transform(({ value }) => new Date(value).toISOString())
  received_at: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => GoodsReceiptLineItemDto)
  line_items: GoodsReceiptLineItemDto[];
}
