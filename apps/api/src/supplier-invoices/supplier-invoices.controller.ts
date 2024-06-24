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
import { SupplierInvoicesService } from './supplier-invoices.service';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';

@Controller('supplier-invoices')
export class SupplierInvoicesController {
  constructor(
    private readonly supplierInvoicesService: SupplierInvoicesService
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  create(@Body() createSupplierInvoiceDto: CreateSupplierInvoiceDto) {
    return this.supplierInvoicesService.create(createSupplierInvoiceDto);
  }

  @Get()
  findAll() {
    return this.supplierInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierInvoicesService.findOne(+id);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierInvoiceDto: UpdateSupplierInvoiceDto
  ) {
    return this.supplierInvoicesService.update(+id, updateSupplierInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierInvoicesService.remove(+id);
  }
}
