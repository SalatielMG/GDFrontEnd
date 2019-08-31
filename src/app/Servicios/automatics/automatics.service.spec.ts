import { TestBed } from '@angular/core/testing';

import { AutomaticsService } from './automatics.service';

describe('AutomaticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutomaticsService = TestBed.get(AutomaticsService);
    expect(service).toBeTruthy();
  });
});
