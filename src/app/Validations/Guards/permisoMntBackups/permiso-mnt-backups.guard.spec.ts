import { TestBed, async, inject } from '@angular/core/testing';

import { PermisoMntBackupsGuard } from './permiso-mnt-backups.guard';

describe('PermisoMntBackupsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermisoMntBackupsGuard]
    });
  });

  it('should ...', inject([PermisoMntBackupsGuard], (guard: PermisoMntBackupsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
