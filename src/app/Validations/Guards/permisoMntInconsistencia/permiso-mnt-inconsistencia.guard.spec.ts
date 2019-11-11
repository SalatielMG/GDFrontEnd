import { TestBed, async, inject } from '@angular/core/testing';

import { PermisoMntInconsistenciaGuard } from './permiso-mnt-inconsistencia.guard';

describe('PermisoMntInconsistenciaGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisoMntInconsistenciaGuard]
    });
  });

  it('should ...', inject([PermisoMntInconsistenciaGuard], (guard: PermisoMntInconsistenciaGuard) => {
    expect(guard).toBeTruthy();
  }));
});
