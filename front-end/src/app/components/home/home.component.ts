import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = "Arc Buddy";

  saved = false;

  changingStats = new Subject<Profile>();

  addingProfiles  = new Subject<Profile>();

  changingProfiles = new Subject<Profile>();

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }

  setProfile(profile: Profile): void {
    this.changingProfiles.next(profile);
  }

  addProfile(profile: Profile): void {
    this.addingProfiles.next(profile);
    this.saved = true;
  }

}
