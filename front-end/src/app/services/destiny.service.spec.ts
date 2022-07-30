import { TestBed } from '@angular/core/testing';

import { DestinyService } from './destiny.service';

describe('DestinyService', () => {
  let service: DestinyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DestinyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
