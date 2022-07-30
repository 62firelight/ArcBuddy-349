import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ProfileService } from './profile.service';
import testData from './test-data';
import { Profile } from '../Profile';

describe('NameService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProfileService);

    // Inject the HTTP service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('can GET all profiles', () => {
    const testProfile: Profile[] = [testData];

    // Make an HTTP GET request
    httpClient.get<Profile[]>('api/players/stats').subscribe((profile) => {
      // When observable resolves, result should match test data
      expect(profile).toEqual(testProfile)
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne('api/players/stats');

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testProfile);
  });
});
