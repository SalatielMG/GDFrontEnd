import { TestBed, async, inject } from '@angular/core/testing';

import { IsSuperAdminOrAdminGuard } from './is-super-admin-or-admin.guard';

describe('IsSuperAdminOrAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsSuperAdminOrAdminGuard]
    });
  });

  it('should ...', inject([IsSuperAdminOrAdminGuard], (guard: IsSuperAdminOrAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
