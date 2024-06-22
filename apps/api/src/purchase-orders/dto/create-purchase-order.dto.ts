import { IsDateString, IsString, IsArray, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

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

  @Transform(({ value }) => new Date(value).toISOString())
  expected_delivery_date: string;

  @Transform(({ value }) => new Date(value).toISOString())
  order_date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderLineItemDto)
  purchase_order_line_items: PurchaseOrderLineItemDto[]; // Define a proper DTO for line items if needed
}