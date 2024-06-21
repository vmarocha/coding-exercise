import { IsDate, IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseOrderLineItemDto {
    @IsNumber()
    item_id: number;
    
    @IsNumber()
    quantity: number;
  
    @IsNumber()
    unit_cost: number;
  }

export class CreatePurchaseOrderDto {
  @IsString()
  vendor_name: string;

  @IsDate()
  @Type(() => Date)
  expected_delivery_date: Date;

  @IsDate()
  order_date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineItemDto)
  purchase_order_line_items: PurchaseOrderLineItemDto[]; // Define a proper DTO for line items if needed
}