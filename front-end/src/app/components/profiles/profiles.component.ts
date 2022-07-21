import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

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

  constructor(private profileService: ProfileService) { }

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

      this.error = 'Profile successfully saved';
    });
  }

  setProfile(profile: Profile): void {
    this.error = '';

    this.profileService.getProfile(profile.displayName).subscribe((result) => {
      this.setProfileEvent.emit(profile);
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
