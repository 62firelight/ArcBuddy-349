import { Component, Input, OnInit } from '@angular/core';
import { DestinyStatPipe } from '../pipes/destinyStat/destiny-stat.pipe';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input()
  displayedStats!: Object;

  statNames!: Set<string>;

  readonly STAT_MAP = new Map([
    ['secondsPlayed', 'Time Played'],
    ['killsDeathsRatio', "KD Ratio"],
    ['kills', 'Kills'],
    ['deaths', 'Deaths'],
    ['activitiesCleared', 'Activites Cleared (PvE)'],
    ['activitiesEntered', 'Activites Entered'],
    ['weaponKillsSuper', 'Super Kills'],
    ['weaponKillsGrenade', 'Grenade Kills'],
    ['weaponKillsMelee', 'Melee Kills'],
    ['publicEventsCompleted', 'Public Events Completed']
  ]);

  constructor() { }

  ngOnInit(): void {
    this.statNames = new Set(Object.keys(this.displayedStats));
    console.log(this.statNames);
  }

  getStatName(name: string): string | undefined {
    const statName = this.STAT_MAP.get(name);
    return statName;
  }

  deriveStat(value: Object): string {
    const destinyStatPipe = new DestinyStatPipe();
    return destinyStatPipe.transform(value);
  }

  isNumber(value: string): boolean {
    return !Number.isNaN(Number(value));
  }

}
