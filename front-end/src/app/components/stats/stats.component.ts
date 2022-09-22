import { animate, style, transition, trigger } from '@angular/animations';
import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { result } from 'lodash';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/index';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
              style({}))
          ]
        ),
        // fade out
        transition(
          ':leave',
          [
            style({}),
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

  error = false;

  newDisplayedStatsEvent = new Subject<Object>();

  @Input()
  changingStats: Subject<Profile> = new Subject<Profile>();

  @Input()
  changingProfiles: Subject<Profile> = new Subject<Profile>();

  @Output()
  addProfileEvent = new EventEmitter<Profile>();

  constructor(private route: ActivatedRoute, private destinyService: DestinyService, private readonly titleService: Title) { }

  ngOnInit(): void {
    // extract route parameters
    const routeParams = this.route.snapshot.paramMap;

    const membershipType = routeParams.get('membershipType');
    const membershipId = routeParams.get('membershipId');

    // by default, show PvE stats for all characters
    this.currentMode = 'Merged';
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
      .pipe(
        switchMap(res => {
          let profile = res;
          this.fetchingCharacters = false;

          return forkJoin([this.destinyService.getStats(this.profile.membershipType, this.profile.membershipId), of(profile)]);
        }),
        switchMap(array => {
          const stats = array[0];
          const profile = array[1];

          profile.mergedStats = stats.mergedStats;
          profile.pveStats = stats.pveStats;
          profile.pvpStats = stats.pvpStats;

          // match IDs from getCharacters() to IDs in getStats() 
          // to find associated stats
          for (var character1 of profile.characters) {
            for (var character2 of stats.characters) {
              if (character1.characterId == character2.characterId) {
                character1.mergedStats = character2.mergedStats;
                character1.pveStats = character2.pveStats;
                character1.pvpStats = character2.pvpStats;
                break;
              }
            }
          }

          // save current date in profile
          profile.dateCreated = new Date();

          return of(profile);
        })
      )
      .subscribe(res => {
        this.profile = res;

        // hide progress spinner
        this.fetchingStats = false;

        // update displayed stats
        this.currentId = '';
        this.displayedStats = this.getMode(this.currentMode);

        // (usually the title strategy would be used for the website name suffix)
        this.titleService.setTitle(`${this.profile.displayName} | Arc Buddy`);
      }, err => {
        this.error = true;
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
      const matchedCharacter = this.profile.characters.find(character => character.characterId == characterId);

      if (matchedCharacter !== undefined && matchedCharacter.mergedStats !== undefined) {
        this.currentId = matchedCharacter.characterId;
        this.displayedStats = this.getMode(this.currentMode);
      }

      // for (var character of this.profile.characters) {
      //   if (characterId == character.characterId && character.mergedStats != undefined) {
      //     this.currentId = character.characterId;
      //     this.displayedStats = this.getMode(this.currentMode);
      //     // console.log(this.displayedStats);
      //   }
      // }
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
      const matchedCharacter = this.profile.characters.find(character => character.characterId == this.currentId);
  
      if (matchedCharacter !== undefined) {
        switch (newMode) {
          case 'Merged':
            if (matchedCharacter.mergedStats != undefined) fetchedStats = matchedCharacter.mergedStats;
            break;

          case 'PvE':
            if (matchedCharacter.pveStats != undefined) fetchedStats = matchedCharacter.pveStats;
            break;

          case 'PvP':
            if (matchedCharacter.pvpStats != undefined) fetchedStats = matchedCharacter.pvpStats;
            break;
        }

        this.currentMode = newMode;
      } else {
        fetchedStats = {};
      }
    }

    // code block for if we want to handle the empty stats object
    // if (Object.values(fetchedStats).length == 0) {
    //   fetchedStats = this.displayedStats;
    //   console.log('Something went wrong. Displaying previously shown stats...');
    // }

    // update displayed events for stat sections
    this.newDisplayedStatsEvent.next(fetchedStats);

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
    switch (parseInt(membershipType)) {
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
