import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';
import testData from 'src/app/services/test-data';
import { ProfileDeleteDialog } from './profile-delete.component';
import { ProfileUpdateDialog } from './profile-update.component';

import { ProfilesComponent } from './profiles.component';

describe('ProfilesComponent', () => {
  const testProfiles: Profile[] = [testData, testData, testData];

  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;

  let fakeProfileService: ProfileService;
  let fakeProfileDeleteDialog: ProfileDeleteDialog;
  let fakeProfileUpdateDialog: ProfileUpdateDialog;

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
        { provide: ProfileService, useValue: fakeProfileService },
        { provide: MatDialog, useValue: fakeProfileDeleteDialog },
        { provide: MatDialog, useValue: fakeProfileUpdateDialog }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('find all profiles', () => {
    component.refresh();

    // check that getProfiles has been called
    expect(fakeProfileService.getProfiles).toHaveBeenCalled();
    
    // check that profiles matches test profiles
    expect(component.profiles).toBe(testProfiles);
  });
});
