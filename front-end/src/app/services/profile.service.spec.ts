import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from './profile.service';

describe('NameService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(ProfileService);

    // Inject the HTTP service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController =  TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
