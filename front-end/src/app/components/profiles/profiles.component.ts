import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileDeleteDialog } from './profile-delete.component';
import { ProfileUpdateDialog } from './profile-update.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  profiles!: Profile[]

  error = '';

  fetchingProfiles = false;

  @Input()
  addingProfiles = new Subject<Profile>();

  @Input()
  changingProfiles = new Subject<Profile>();

  @Output()
  setProfileEvent = new EventEmitter<Profile>();

  constructor(private profileService: ProfileService, public deleteDialog: MatDialog, public updateDialog: MatDialog) { }

  ngOnInit(): void {
    this.refresh();

    this.addingProfiles.subscribe((profile) => {
      const existingProfile = this.profiles.find((profile) => profile.displayName == profile.displayName);

      if (existingProfile != undefined) {
        console.log(`Profile already exists at ${existingProfile.dateCreated.toLocaleString()}`);

        // this.updateProfile(profile);
        this.openUpdateDialog(profile, existingProfile);
      } else {
        this.addProfile(profile);
      }      
    });

    this.changingProfiles.subscribe((profile) => {
      this.setProfile(profile);
    });
  }

  refresh(): void {
    this.error = '';

    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;
      this.fetchingProfiles = false;
    });

    this.fetchingProfiles = true;
  }

  addProfile(profile: Profile): void {
    this.error = '';

    this.profileService.addProfile(profile).subscribe(() => {
      // console.log(`Successfully saved ${profile.displayName}`);
      this.refresh();

      this.error = `${profile.displayName} successfully saved at ${profile.dateCreated.toLocaleString()}`;
    });
  }

  setProfile(profile: Profile): void {
    this.error = '';

    this.profileService.getProfile(profile.displayName).subscribe((result) => {
      this.setProfileEvent.emit(profile);
    });
  }

  openUpdateDialog(profile: Profile, originalProfile: Profile): void {
    const dialogRef = this.updateDialog.open(ProfileUpdateDialog, {
      data: {
        profile: profile,
        originalProfile: originalProfile
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Update ${profile.displayName}? ${result}`);

      if (result == true) {
        this.updateProfile(profile);
      }
    });
  }

  updateProfile(profile: Profile): void {
    this.error = '';

    this.profileService.updateProfile(profile.displayName, profile).subscribe((result) => {
      this.refresh();
      this.fetchingProfiles = false;
    });
  }

  openDeleteDialog(profile: Profile): void {
    const dialogRef = this.deleteDialog.open(ProfileDeleteDialog, {
      data: profile
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Delete ${profile.displayName}? ${result}`);

      if (result == true) {
        this.deleteProfile(profile);
      }
    });
  }

  deleteProfile(profile: Profile): void {
    this.error = '';

    this.profileService.deleteProfile(profile.displayName).subscribe((result) => {
      // console.log(`Successfully deleted ${profile.displayName}`);
      this.refresh();
      this.fetchingProfiles = false;
    })
  }

}
