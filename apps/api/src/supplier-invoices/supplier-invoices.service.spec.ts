import { Test, TestingModule } from '@nestjs/testing';
import { SupplierInvoicesService } from './supplier-invoices.service';

describe('SupplierInvoicesService', () => {
  let service: SupplierInvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierInvoicesService],
    }).compile();

    service = module.get<SupplierInvoicesService>(SupplierInvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
