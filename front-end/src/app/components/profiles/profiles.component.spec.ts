import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';
import testData from 'src/app/services/test-data';

import { ProfilesComponent } from './profiles.component';

describe('ProfilesComponent', () => {
  const testProfiles: Profile[] = [testData, testData, testData];

  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;

  let fakeProfileService: ProfileService;

  beforeEach(async () => {
    // Create fake profile service
    fakeProfileService = jasmine.createSpyObj<ProfileService>(
      'ProfileService',
      {
        getProfiles: of(testProfiles),
        getProfile: undefined,
        addProfile: undefined,
        updateProfile: undefined,
        deleteProfile: undefined
      }
    );

    await TestBed.configureTestingModule({
      declarations: [ ProfilesComponent ],
      providers: [
        // Use fake instead of original
        { provide: ProfileService, useValue: fakeProfileService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
