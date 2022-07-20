import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/Character';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

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

  displayedStats!: Object;
  currentId!: string;
  currentMode!: string;
  statsVisibility = true;
  // @ViewChild(StatsComponent) stats!: StatsComponent;

  fetchingCharacters = false;
  fetchingStats = false;
  fetchingProfiles = false;
  saved = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.currentMode = 'Merged';
    this.currentId = '';

    this.profileService.getProfiles().subscribe((profiles) => {
      this.profiles = profiles;

      // if (profiles != null) {
      //   // take ".json" out of the key
      //   this.profiles.forEach(function (profile) {
      //     profile.Key = profile.Key?.slice(0, -5);
      //   });
      // }

      // console.log(profiles);
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
      // console.log(result);
      this.error = ``;
      this.profile = result;
      this.profile.iconPath = `https://www.bungie.net${this.profile.iconPath}`;
      this.fetchStats(this.profile);
      // this.getStats(this.profile); // force update
      this.saved = false;
    }, (error) => {
      this.error = `Couldn't find requested Bungie Name. Are you sure that ${this.name} is a registered Bungie.net user?`;
    });
  }

  fetchStats(profile: Profile): void {
    this.profile = profile;
    this.fetchingStats = true;
    this.fetchingCharacters = true;

    this.profileService.getCharacters(this.profile.membershipType, this.profile.membershipId)
      .subscribe((result) => {
        this.profile.characters = result;

        this.fetchingCharacters = false;

        this.profileService.getStats(this.profile.membershipType, this.profile.membershipId)
          .subscribe((result2: any) => {
            this.profile.mergedStats = result2.mergedStats;
            this.profile.pveStats = result2.pveStats;
            this.profile.pvpStats = result2.pvpStats;

            this.profile.characters.forEach((character1) => {
              result2.characters.forEach((character2: Character) => {
                if (character1.characterId == character2.characterId) {
                  character1.mergedStats = character2.mergedStats;
                  character1.pveStats = character2.pveStats;
                  character1.pvpStats = character2.pvpStats;
                }
              })
            });

            console.log(this.profile);

            // filter by key of object
            // console.log(Object.keys(this.profile.mergedStats).filter(name => name.includes("Weapon")));

            this.currentId = '';
            this.fetchingStats = false;
            this.saved = false;

            // this.displayedStats = this.profile.mergedStats;
            this.displayedStats = this.getMode(this.currentMode);
          });
      });
  }

  updateStats(characterId: string): void {
    console.log(characterId.length == 0 ? 
      `Showing all stats for ${this.profile.displayName}` : 
      `Showing stats for character ID ${characterId}`);

    if (characterId.length == 0) {
      this.currentId = '';
      this.displayedStats = this.getMode(this.currentMode);
    } else {
      for (var character of this.profile.characters) {
        if (characterId == character.characterId && character.mergedStats != undefined) {
          this.currentId = character.characterId;
          this.displayedStats = this.getMode(this.currentMode);
        }
      }
    }
  }

  getMode(newMode: string): Object {
    console.log(`Showing ${newMode} stats`);

    var fetchedStats = {};

    if (this.currentId == '') {
      switch (newMode) {
        case 'Merged':
          fetchedStats = this.profile.mergedStats;
          break;

        case 'PvE':
          fetchedStats = this.profile.pveStats;
          break;

        case 'PvP':
          fetchedStats = this.profile.pvpStats;
          break;
      }

    } else {
      for (var character of this.profile.characters) {
        if (character.characterId == this.currentId) {
          switch (newMode) {
            case 'Merged':
              if (character.mergedStats != undefined) fetchedStats = character.mergedStats;
              break;

            case 'PvE':
              if (character.pveStats != undefined) fetchedStats = character.pveStats;
              break;

            case 'PvP':
              if (character.pvpStats != undefined) fetchedStats = character.pvpStats;
              break;
          }

          this.currentMode = newMode;
        }
      }
    }

    if (fetchedStats == {}) {
      fetchedStats = this.displayedStats;
      console.log('Something went wrong. Displaying previously shown stats...');
    }

    // console.log(fetchedStats);

    return fetchedStats;
  }

  checkEmptyObject(obj: Object) {
    return Object.keys(obj).length == 0;
  }

  setProfile(profile: Profile): void {
    // console.log(profile);

    this.profileService.getProfile(profile.displayName).subscribe((result) => {
      this.profile = result;
      this.currentId = '';
      this.updateStats(this.currentId);
      this.saved = false;
    });
  }

  deleteProfile(profile: Profile): void {
    this.profileService.deleteProfile(profile.displayName).subscribe((result) => {
      this.ngOnInit();
      this.fetchingProfiles = false;
      this.saved = false;
    })
  }

  addProfile(profile: Profile): void {
    this.profileService.addProfile(profile).subscribe(() => {
      // console.log("Successfully saved profile");
      this.ngOnInit();
      this.saved = true;
    });
  }

}
