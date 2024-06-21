import { IsDateString, IsString, IsArray, IsNumber, ValidateNested, ValidateIf, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseOrderLineItemDto {
    @IsNumber()
    @Min(1)
    item_id: number;
    
    @IsNumber()
    quantity: number;
  
    @IsNumber()
    unit_cost: number;
  }

export class CreatePurchaseOrderDto {
  @IsString()
  vendor_name: string;

  @IsDateString()
  @ValidateIf(o => new Date(o.order_date) < new Date(o.expected_delivery_date))
  expected_delivery_date: Date;

  @IsDateString()
  order_date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineItemDto)
  purchase_order_line_items: PurchaseOrderLineItemDto[]; // Define a proper DTO for line items if needed
}