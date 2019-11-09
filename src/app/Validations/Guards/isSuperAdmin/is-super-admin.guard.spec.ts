import { TestBed, async, inject } from '@angular/core/testing';

import { IsSuperAdminGuard } from './is-super-admin.guard';

describe('IsSuperAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsSuperAdminGuard]
    });
  });

  it('should ...', inject([IsSuperAdminGuard], (guard: IsSuperAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
