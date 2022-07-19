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
  displayingCharacter!: boolean;
  displayedStats!: Object;
  currentId!: string;
  currentMode!: number;
  statsVisibility = true;
  // @ViewChild(StatsComponent) stats!: StatsComponent;

  fetchingCharacters = false;
  fetchingStats = false;
  fetchingProfiles = false;
  saved = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
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
            this.displayingCharacter = false;
            this.fetchingStats = false;
            this.saved = false;

            this.displayedStats = this.profile.mergedStats;
          });
      });
  }

  updateStats(characterId: string): void {
    // console.log(`search received ${characterId}`);

    if (characterId.length == 0) {
      this.displayedStats = this.profile.mergedStats;
      this.currentId = '';
      this.displayingCharacter = false;
    } else {
      this.profile.characters.forEach((character) => {
        if (character.characterId == characterId && character.mergedStats != undefined) {
          this.displayedStats = character.mergedStats;
          this.currentId = character.characterId;
          return;
        }
      });
      this.displayingCharacter = true;
    }
  }

  updateMode(mode: number): void {
    switch (mode) {

      // Merged
      case 0:
        if (this.displayingCharacter == false) {
          this.displayedStats = this.profile.mergedStats;
        } else {
          this.profile.characters.forEach((character) => {
            if (character.characterId == this.currentId && character.mergedStats != undefined) {
              this.displayedStats = character.mergedStats;
              this.currentMode = mode;
              return;
            }
          });
        }
        break;

      // PvE
      case 1:
        if (this.displayingCharacter == false) {
          this.displayedStats = this.profile.pveStats;
        } else {
          this.profile.characters.forEach((character) => {
            if (character.characterId == this.currentId && character.pveStats != undefined) {
              this.displayedStats = character.pveStats;
              this.currentMode = mode;
              return;
            }
          });
        }
        break;

      // PvP
      case 2:
        if (this.displayingCharacter == false) {
          this.displayedStats = this.profile.pvpStats;
        } else {
          this.profile.characters.forEach((character) => {
            if (character.characterId == this.currentId && character.pvpStats != undefined) {
              this.displayedStats = character.pvpStats;
              this.currentMode = mode;
              return;
            }
          });
        }
        break;
      default:
        break;
    }
  }

  setProfile(profile: Profile): void {
    // console.log(profile);

    this.profileService.getProfile(profile.Key).subscribe((result) => {
      this.profile = result;
      this.saved = false;
    });
  }

  deleteProfile(profile: Profile): void {
    this.profileService.deleteProfile(profile.Key).subscribe((result) => {
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
