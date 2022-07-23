import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';
import { ProfileDeleteDialog } from './profile-delete.component';

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

  constructor(private profileService: ProfileService, public deleteDialog: MatDialog) { }

  ngOnInit(): void {
    this.refresh();

    this.addingProfiles.subscribe((profile) => {
      this.addProfile(profile);
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
