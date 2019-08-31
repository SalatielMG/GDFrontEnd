import { TestBed } from '@angular/core/testing';

import { BudgetsService } from './budgets.service';

describe('BudgetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BudgetsService = TestBed.get(BudgetsService);
    expect(service).toBeTruthy();
  });
});
