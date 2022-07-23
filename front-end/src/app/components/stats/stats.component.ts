import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Character } from 'src/app/Character';
import { Helper } from 'src/app/Helper';
import { Profile } from 'src/app/Profile';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  sections = new Map([
    ['General',
      new Map([
        ['secondsPlayed', 'Time Played'],
        ['killsDeathsRatio', "KD Ratio"],
        ['kills', 'Kills'],
        ['assists', 'Assists'],
        ['deaths', 'Deaths'],
        ['efficiency', 'Efficiency'],
        ['activitiesCleared', 'Activites Cleared (PvE)'],
        ['activitiesEntered', 'Activites Entered'],
        ['precisionKills', 'Precision Kills'],
        ['weaponKillsSuper', 'Super Kills'],
        ['weaponKillsGrenade', 'Grenade Kills'],
        ['weaponKillsMelee', 'Melee Kills']
        // ['publicEventsCompleted', 'Public Events Completed']
      ])
    ],
    ['Weapon Kills',
      new Map([
        ['weaponKillsAutoRifle', 'Auto Rifle'],
        // ['weaponKillsBeamRifle', 'Beam Rifle'],
        ['weaponKillsPulseRifle', 'Pulse Rifle'],
        ['weaponKillsScoutRifle', 'Scout Rifle'],
        ['weaponKillsHandCannon', 'Hand Cannon'],
        ['weaponKillsSubmachinegun', 'Submachine Gun'],
        ['weaponKillsSideArm', 'Sidearm'],
        ['weaponKillsBow', 'Bow'],
        ['weaponKillsGlaive', 'Glaive'],
        ['weaponKillsFusionRifle', 'Fusion Rifle'],
        ['weaponKillsTraceRifle', 'Trace Rifle'],
        ['weaponKillsShotgun', 'Shotgun'],
        ['weaponKillsSniper', 'Sniper Rifle'],
        ['weaponKillsMachineGun', 'Machine Gun'],
        ['weaponKillsRocketLauncher', 'Rocket Launcher'],
        // ['weaponKillsRelic', 'Relic'],
        ['weaponKillsSword', 'Sword'],
        ['weaponKillsGrenadeLauncher', 'Grenade Launcher']
      ])
    ],
    [
      'Destination',
      new Map([
        ['publicEventsCompleted', 'Public Events Completed'],
        ['heroicPublicEventsCompleted', 'Heroic Public Events Completed'],
        ['adventuresCompleted', 'Adventures Completed']
      ])
    ]
  ]);

  profile!: Profile;

  displayedStats!: any;

  currentId!: string;

  currentMode!: string;

  statsVisibility = true;

  fetchingCharacters = false;

  fetchingStats = false;

  fetchingProfiles = false;

  newDisplayedStatsEvent = new Subject<Object>();

  helper = Helper;

  @Input()
  changingStats: Subject<Profile> = new Subject<Profile>();

  @Input()
  changingProfiles: Subject<Profile> = new Subject<Profile>();

  @Output()
  addProfileEvent = new EventEmitter<Profile>();

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.currentMode = 'PvE';
    this.currentId = '';

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

            for (var character1 of this.profile.characters) {
              for (var character2 of result2.characters) {
                if (character1.characterId == character2.characterId) {
                  character1.mergedStats = character2.mergedStats;
                  character1.pveStats = character2.pveStats;
                  character1.pvpStats = character2.pvpStats;
                  break;
                }
              }
            }

            console.log(this.profile);

            // filter by key of object
            // console.log(Object.keys(this.profile.mergedStats).filter(name => name.includes("Weapon")));

            // save current date in profile
            this.profile.dateCreated = new Date();
            this.currentId = '';
            this.fetchingStats = false;

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
          console.log(this.displayedStats);
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

    this.newDisplayedStatsEvent.next(fetchedStats);

    return fetchedStats;
  }

  checkEmptyObject(obj: Object) {
    return Object.keys(obj).length == 0;
  }

  addProfile(profile: Profile) {
    this.addProfileEvent.emit(profile);
  }

  ngOnDestroy(): void {
    this.changingStats.unsubscribe();

    this.changingProfiles.unsubscribe();
  }

}
