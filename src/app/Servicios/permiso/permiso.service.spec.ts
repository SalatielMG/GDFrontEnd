import { TestBed } from '@angular/core/testing';

import { PermisoService } from './permiso.service';

describe('PermisoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermisoService = TestBed.get(PermisoService);
    expect(service).toBeTruthy();
  });
});
