import { TestBed, async, inject } from '@angular/core/testing';

import { SessionActiveGuard } from './session-active.guard';

describe('SessionActiveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionActiveGuard]
    });
  });

  it('should ...', inject([SessionActiveGuard], (guard: SessionActiveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
