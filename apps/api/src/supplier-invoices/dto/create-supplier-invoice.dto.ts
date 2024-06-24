import { IsNotEmpty, IsNumber, IsDateString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type, Transform} from 'class-transformer';

class SupplierInvoiceLineItemDto {
  @IsNotEmpty()
  @IsNumber()
  item_id: number;

  @IsNotEmpty()
  @IsNumber()
  quantity_invoiced: number;

  @IsNotEmpty()
  @IsNumber()
  unit_cost: number;
}

export class CreateSupplierInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  purchase_order_id: number;

  @Transform(({ value }) => new Date(value).toISOString())
  invoice_date: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SupplierInvoiceLineItemDto)
  line_items: SupplierInvoiceLineItemDto[];
}
