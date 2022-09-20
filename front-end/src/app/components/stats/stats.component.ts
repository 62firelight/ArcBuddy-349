import { animate, style, transition, trigger } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Character } from 'src/app/Character';
import { Helper } from 'src/app/Helper';
import { Profile } from 'src/app/Profile';
import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        // fade in
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out', 
                    style({ }))
          ]
        ),
        // fade out
        transition(
          ':leave', 
          [
            style({ }),
            animate('0.25s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class StatsComponent implements OnInit {

  helper = Helper;

  sections = Helper.sections;

  profile!: Profile;

  displayedStats!: any;

  currentId!: string;

  currentMode!: string;

  statsVisibility = true;

  fetchingCharacters = false;

  fetchingStats = false;

  fetchingProfiles = false;

  newDisplayedStatsEvent = new Subject<Object>();

  @Input()
  changingStats: Subject<Profile> = new Subject<Profile>();

  @Input()
  changingProfiles: Subject<Profile> = new Subject<Profile>();

  @Output()
  addProfileEvent = new EventEmitter<Profile>();

  constructor(private route: ActivatedRoute, private destinyService: DestinyService) { }

  ngOnInit(): void {
    // extract route parameters
    const routeParams = this.route.snapshot.paramMap;
    
    const membershipType = routeParams.get('membershipType');
    const membershipId = routeParams.get('membershipId');

    // by default, show PvE stats for all characters
    this.currentMode = 'PvE';
    this.currentId = '';

    if (membershipType != null && membershipId != null) {
      this.fetchStats({
        membershipType: membershipType,
        membershipId: membershipId
      });
    }

    // update stats and profiles when needed
    this.changingStats.subscribe((profile) => {
      this.profile = profile;
      this.profile.iconPath = `https://www.bungie.net${profile.iconPath}`;

      this.fetchStats(profile);
    });
    this.changingProfiles.subscribe((profile) => {
      this.profile = profile;
      this.currentId = '';

      this.updateStats(this.currentId);
    });
  }

  /* 
    Fetches all historical stats that are associated with a given
    profile.  
  */
  fetchStats(profile: any): void {
    this.profile = profile;
    this.fetchingStats = true;
    this.fetchingCharacters = true;

    // get IDs for all characters associated with given profile
    this.destinyService.getCharacters(this.profile.membershipType, this.profile.membershipId)
      .subscribe((characters: any) => {
        // console.log(characters);
        this.profile = characters;
        // this.profile.characters = characters.characters;
        this.fetchingCharacters = false;

        // get all stats for the given profile
        this.destinyService.getStats(this.profile.membershipType, this.profile.membershipId)
          .subscribe((profile: any) => {
            this.profile.mergedStats = profile.mergedStats;
            this.profile.pveStats = profile.pveStats;
            this.profile.pvpStats = profile.pvpStats;

            // match IDs from getCharacters() to IDs in getStats() 
            // to find associated stats
            for (var character1 of this.profile.characters) {
              for (var character2 of profile.characters) {
                if (character1.characterId == character2.characterId) {
                  character1.mergedStats = character2.mergedStats;
                  character1.pveStats = character2.pveStats;
                  character1.pvpStats = character2.pvpStats;
                  break;
                }
              }
            }
            // console.log(this.profile);

            // save current date in profile
            this.profile.dateCreated = new Date();
            this.currentId = '';

            // update displayed stats
            this.displayedStats = this.getMode(this.currentMode);

            // console.log(this.profile);

            this.fetchingStats = false;
          });
      });
  }

  /* 
    Updates displayedStats according to the given character ID.

    If an empty character ID string is provided, then the merged stats for the
    profile will be shown.
  */
  updateStats(characterId: string): void {
    // console.log(characterId.length == 0 ?
    //   `Showing all stats for ${this.profile.displayName}` :
    //   `Showing stats for character ID ${characterId}`);

    if (characterId.length == 0) {
      // show profile-wide stats
      this.currentId = '';
      this.displayedStats = this.getMode(this.currentMode);
    } else {
      // show all stats with associated character
      for (var character of this.profile.characters) {
        if (characterId == character.characterId && character.mergedStats != undefined) {
          this.currentId = character.characterId;
          this.displayedStats = this.getMode(this.currentMode);
          // console.log(this.displayedStats);
        }
      }
    }
  }

  /*
    Returns the stats associated with a given mode.

    A mode can be Merged (i.e. PvE + PvP), PvE, or PvP.
  */
  getMode(newMode: string): Object {
    // console.log(`Showing ${newMode} stats`);

    var fetchedStats = {};

    if (this.currentId == '') {
      // show profile-wide stats for given mode
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

      this.currentMode = newMode;
    } else {
      // show character-specific stats for given mode
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

    // fetchedStats should not be empty;
    // but if it is, keep displayedStats the same
    if (fetchedStats == {}) {
      fetchedStats = this.displayedStats;
      // console.log('Something went wrong. Displaying previously shown stats...');
    }
    // console.log(fetchedStats);

    // update displayed events for stat sections
    this.newDisplayedStatsEvent.next(fetchedStats);

    // console.log(this.currentMode);

    return fetchedStats;
  }

  log(value: any) {
    console.log(value);
  }

  checkEmptyObject(obj: Object) {
    return Object.keys(obj).length == 0;
  }

  addProfile(profile: Profile) {
    this.addProfileEvent.emit(profile);
  }

  getPlatform(membershipType: string) {
    switch(parseInt(membershipType)) {
      case 1:
        return 'xb';
      case 2:
        return 'ps';
      case 3:
        return 'pc';
      case 4:
        return 'blizz'; // not sure if correct -- Battle.net is no longer supported
      case 5:
        return 'stadia';
      case 6:
        return 'egs'; // assumption -- EGS is a recent addition
      default: 
        return 'pc';
    }
  }

  ngOnDestroy(): void {
    this.changingStats.unsubscribe();

    this.changingProfiles.unsubscribe();
  }

}
