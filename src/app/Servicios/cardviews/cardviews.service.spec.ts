import { TestBed } from '@angular/core/testing';

import { CardviewsService } from './cardviews.service';

describe('CardviewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CardviewsService = TestBed.get(CardviewsService);
    expect(service).toBeTruthy();
  });
});
