import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/profile.service';

import { ProfilesComponent } from './profiles.component';

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let fixture: ComponentFixture<ProfilesComponent>;
  let profileService: ProfileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilesComponent ],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [ProfileService]
    })
    .compileComponents();
    profileService = TestBed.inject(ProfileService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const module = TestBed.inject(MatDialogModule);
    expect(component).toBeTruthy();
  });
});
