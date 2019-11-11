import { TestBed, async, inject } from '@angular/core/testing';

import { PermisoExportacionGuard } from './permiso-exportacion.guard';

describe('PermisoExportacionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisoExportacionGuard]
    });
  });

  it('should ...', inject([PermisoExportacionGuard], (guard: PermisoExportacionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
