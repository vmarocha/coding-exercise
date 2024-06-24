import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException
} from '@nestjs/common';
import { SupplierInvoicesService } from './supplier-invoices.service';
import { CreateSupplierInvoiceDto } from './dto/create-supplier-invoice.dto';
import { UpdateSupplierInvoiceDto } from './dto/update-supplier-invoice.dto';

@Controller('supplier-invoices')
export class SupplierInvoicesController {
  constructor(
    private readonly supplierInvoicesService: SupplierInvoicesService
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createSupplierInvoiceDto: CreateSupplierInvoiceDto) {
    return this.supplierInvoicesService.create(createSupplierInvoiceDto);
  }

  @Get()
  findAll() {
    return this.supplierInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.supplierInvoicesService.findOne(numericId);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateSupplierInvoiceDto: UpdateSupplierInvoiceDto
  ) {
    return this.supplierInvoicesService.update(+id, updateSupplierInvoiceDto);
  }
}
