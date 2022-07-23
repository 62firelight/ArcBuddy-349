import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DestinyStatPipe } from '../pipes/destinyStat/destiny-stat.pipe';

@Component({
  selector: 'app-stat-section',
  templateUrl: './stat-section.component.html',
  styleUrls: ['./stat-section.component.css']
})
export class StatSectionComponent implements OnInit {

  @Input()
  section?: Map<string, string>;

  @Input()
  sectionName!: string;

  @Input()
  displayedStats!: Object;

  @Input()
  newDisplayedStatsEvent = new Subject<Object>();

  stats = new Map<string, string>();

  isVisible = true;

  constructor() { }

  ngOnInit(): void {
    this.updateStats();

    this.newDisplayedStatsEvent.subscribe((fetchedStats) => {
      this.displayedStats = fetchedStats;
      this.updateStats();
    });
    
  }

  updateStats(): void {
    if (this.displayedStats == undefined || this.section == undefined) {
      return;
    }

    this.stats.clear();

    var array1 = Array.from(this.section.keys());
    var array2 = Object.keys(this.displayedStats);

    var includedStats = array1.filter(value => array2.includes(value));
    var displayedStatsMap = new Map(Object.entries(this.displayedStats));

    for (let name of includedStats) {
      const statName = this.section.get(name);
      if (statName == undefined) {
        continue;
      }

      const statValue = displayedStatsMap.get(name);
      if (statValue == undefined) {
        continue;
      }

      this.stats.set(statName, statValue);
    }

    if (this.stats.size <= 0) {
      this.isVisible = false;
    }
  }

  asIsOrder() {
    return 1;
  }

  numberedKeyOrder(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    const aStepId = parseInt(a.key, 10);
    const bStepId = parseInt(b.key, 10);
    return aStepId > bStepId ? 1 : (bStepId > aStepId ? -1 : 0);
  }
}
