import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Profile } from 'src/app/Profile';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input()
  profile!: Profile;

  @Input()
  displayedStats!: Object;
  
  @Input()
  currentId!: string;

  @Input()
  currentMode!: string;

  @Input()
  statsVisibility = true;

  @Input()
  fetchingCharacters = false;

  @Input()
  fetchingStats = false;

  @Input()
  fetchingProfiles = false;

  @Input()
  saved = false;

  @Output()
  addProfileEvent = new EventEmitter<Profile>();

  constructor() { }

  ngOnInit(): void {
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

  addProfile(profile: Profile) {
    this.addProfileEvent.emit(profile);
  }

}
