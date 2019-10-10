import { TestBed } from '@angular/core/testing';

import { AccountscategoriesService } from './accountscategories.service';

describe('AccountscategoriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountscategoriesService = TestBed.get(AccountscategoriesService);
    expect(service).toBeTruthy();
  });
});
