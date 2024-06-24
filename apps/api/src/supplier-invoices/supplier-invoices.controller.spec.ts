import { Test, TestingModule } from '@nestjs/testing';
import { SupplierInvoicesController } from './supplier-invoices.controller';
import { SupplierInvoicesService } from './supplier-invoices.service';

describe('SupplierInvoicesController', () => {
  let controller: SupplierInvoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierInvoicesController],
      providers: [SupplierInvoicesService],
    }).compile();

    controller = module.get<SupplierInvoicesController>(
      SupplierInvoicesController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
