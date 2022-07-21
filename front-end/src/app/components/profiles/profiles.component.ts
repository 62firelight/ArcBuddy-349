import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  profiles!: Profile[]

  fetchingProfiles = false;
  
  saved = false;

  @Output()
  setProfileEvent = new EventEmitter<Profile>();

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;
      this.fetchingProfiles = false;
    });

    this.fetchingProfiles = true;
  }

  setProfile(profile: Profile): void {
    this.profileService.getProfile(profile.displayName).subscribe((result) => {
      this.setProfileEvent.emit(profile);
    });
  }

  deleteProfile(profile: Profile): void {
    this.profileService.deleteProfile(profile.displayName).subscribe((result) => {
      this.ngOnInit();
      this.fetchingProfiles = false;
      this.saved = false;
    })
  }

}
