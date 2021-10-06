import { Component, OnInit, ViewChild } from '@angular/core';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  title = "Arc Buddy";

  name!: string;
  error!: string;
  profile!: Profile;
  profiles!: Profile[];
  statsVisibility = true;
  // @ViewChild(StatsComponent) stats!: StatsComponent;

  fetchingStats = false;
  fetchingProfiles = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;

      if (profiles != null) {
        // take ".json" out of the key
        this.profiles.forEach(function (profile) {
          profile.Key = profile.Key?.slice(0, -5);
        });
      }
      
      console.log(profiles);
      this.fetchingProfiles = false;
    });

    this.fetchingProfiles = true;
  }

  onSubmit(): void {
    if (this.name == undefined) {
      this.error = `Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".`;
      return;
    }

    var nameId = this.name.split("#", 2);

    if (nameId == undefined || nameId.length != 2) {
      this.error = `Error occurred when parsing Bungie Name. A Bungie Name should formatted similarly to "name#1234".`;
      return;
    }

    var name = nameId[0];
    var id = nameId[1];

    // console.log("Bungie name: " + name + "#" + id);

    this.profileService.getName(name, id).subscribe((result) => {
      console.log(result);
      this.error = ``;
      this.profile = result;
      this.profile.iconPath = `https://www.bungie.net${this.profile.iconPath}`;
      this.getStats(this.profile); // force update
    }, (error) => {
      this.error = `Couldn't find requested Bungie Name. Are you sure that ${this.name} is a registered Bungie.net user?`;
    });
  }

  toggleStats() {
    this.statsVisibility = !this.statsVisibility;
  }

  setProfile(profile: Profile) {
    console.log(profile);

    this.profileService.getProfile(profile.Key).subscribe((result) => {
      this.profile = result;
    });
  }

  deleteProfile(profile: Profile) {
    this.profileService.deleteProfile(profile.Key).subscribe((result) => {
      this.ngOnInit();
      this.fetchingProfiles = false;
    })
  }

  getStats(profile: Profile): void {
    this.profile = profile;

    this.profileService.getStats(this.profile.membershipType, this.profile.membershipId)
    .subscribe((result) => {
      this.profile.characterStats = result;
      console.log(this.profile.characterStats);
      this.fetchingStats = false;
    });

    this.fetchingStats = true;
  }

  addProfile(profile: Profile): void {
    this.profileService.addProfile(profile).subscribe(() => {
      console.log("Successfully saved profile");
      this.ngOnInit();
    });
  }

}
