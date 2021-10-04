import { TestBed } from '@angular/core/testing';

import { NameService } from './profile.service';

describe('NameService', () => {
  let service: NameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
