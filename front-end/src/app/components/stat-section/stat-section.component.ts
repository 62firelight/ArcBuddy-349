import { Component, Input, ModuleWithComponentFactories, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { Subject } from 'rxjs';
import { Helper } from 'src/app/Helper';
import { DestinyStatPipe } from '../pipes/destinyStat/destiny-stat.pipe';

@Component({
  selector: 'app-stat-section',
  templateUrl: './stat-section.component.html',
  styleUrls: ['./stat-section.component.css']
})
export class StatSectionComponent implements OnInit {

  helper = Helper;

  breakpoint = 5;

  chartableSections = Helper.chartableSections;

  stats = new Map<string, any>();

  isVisible = true;

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: 'Weapon Kills',
      //   color: 'white'
      // },
      legend: {
        display: true,
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white'
        },
      },
      y: {
        ticks: {
          color: 'white'
        },
      }
    }
  };

  barChartType: ChartType = 'bar';

  allWeaponsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Weapon Kills',
        backgroundColor: '#008080',
        hoverBackgroundColor: 'orange'
      }
    ],
  };

  primaryChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Primary Weapon Kills',
        backgroundColor: 'white',
        hoverBackgroundColor: 'orange'
      }
    ],
  };

  specialChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Special Weapon Kills',
        backgroundColor: '#82D56A',
        hoverBackgroundColor: 'orange'
      }
    ],
  };

  heavyChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Heavy Weapon Kills',
        backgroundColor: '#8063D7',
        hoverBackgroundColor: 'orange'
      }
    ],
  };

  showAsChart = false;

  @Input()
  section?: Map<string, string>;

  @Input()
  sectionName!: string;

  @Input()
  displayedStats!: Object;

  @Input()
  newDisplayedStatsEvent = new Subject<Object>();

  constructor() { }

  ngOnInit(): void {
    this.breakpoint = this.getColumns(window.innerWidth);

    this.updateStats();

    this.newDisplayedStatsEvent.subscribe((fetchedStats) => {
      this.displayedStats = fetchedStats;
      this.updateStats();

      if (this.showAsChart == true) {
        this.convertToChart();
      }
    });

  }

  getColumns(width: number): number {
    if (width > 800) {
      return 5;
    } else if (width > 700) {
      return 3;
    } else if (width > 500) {
      return 2;
    } else if (width > 265) {
      return 2;
    } else {
      return 1;
    }
  }

  onResize(event: any) {
    this.breakpoint = this.getColumns(event.target.innerWidth);
  }

  updateStats(): void {
    if (this.displayedStats == undefined || this.section == undefined) {
      return;
    }

    this.stats.clear();

    // create array from the keys of our section map
    let sectionKeys = Array.from(this.section.keys());
    // create array from the keys of the displayedStats object
    let displayedStatsKeys = Object.keys(this.displayedStats);

    // create array from the union intersection of keys from both section and displayedStats
    let includedStats = sectionKeys.filter(value => displayedStatsKeys.includes(value));
    // create a map from the entries of displayedStats
    let displayedStatsMap = new Map(Object.entries(this.displayedStats));

    // create a new stats map with the stats that should be included in each section
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

    // in case includedStats is empty, hide this stat section
    if (this.stats.size <= 0) {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
  }

  convertToChart(): void {
    this.showAsChart = true;

    // All Weapons
    this.allWeaponsChartData.labels = Array.from(this.stats.keys());
    this.allWeaponsChartData.datasets[0].data = Array.from(this.stats.values()).map((item) => {
      const destinyStatPipe = new DestinyStatPipe();
      return parseFloat(destinyStatPipe.transform(item, true));
    });
    
    // Primary Weapons
    this.primaryChartData.labels = Array.from(this.stats.keys()).filter(key => Helper.primaryWeapons.includes(key));
    this.primaryChartData.datasets[0].data = Array.from(this.stats.values()).filter((item) => {
      const statName = Helper.sections.get('Weapon Kills')?.get(item.statId);
      if (statName != undefined && Helper.primaryWeapons.includes(statName)) {
        return true;
      }

      return false;
    }).map((item) => {
      const destinyStatPipe = new DestinyStatPipe();
      return parseFloat(destinyStatPipe.transform(item, true));
    });

    // Special Weapons
    this.specialChartData.labels = Array.from(this.stats.keys()).filter(key => Helper.specialWeapons.includes(key));
    this.specialChartData.datasets[0].data = Array.from(this.stats.values()).filter((item) => {
      const statName = Helper.sections.get('Weapon Kills')?.get(item.statId);
      if (statName != undefined && Helper.specialWeapons.includes(statName)) {
        return true; 
      }

      return false;
    }).map((item) => {
      const destinyStatPipe = new DestinyStatPipe();
      return parseFloat(destinyStatPipe.transform(item, true));
    });

    // Heavy Weapons
    this.heavyChartData.labels = Array.from(this.stats.keys()).filter(key => Helper.heavyWeapons.includes(key));
    this.heavyChartData.datasets[0].data = Array.from(this.stats.values()).filter((item) => {
      const statName = Helper.sections.get('Weapon Kills')?.get(item.statId);
      if (statName != undefined && Helper.heavyWeapons.includes(statName)) { 
        return true; 
      }

      return false;
    }).map((item) => {
      const destinyStatPipe = new DestinyStatPipe();
      return parseFloat(destinyStatPipe.transform(item, true));
    });

    Promise.all([this.primaryChartData.datasets[0].data, this.specialChartData.datasets[0].data, this.heavyChartData.datasets[0].data]).then(() => {
      // update all charts
      if (this.charts !== undefined) {
        this.charts.forEach((child) => {
          if (child !== undefined && child.chart !== undefined) {
            child.chart.update();
          }
        });
      }
    });
  }

  convertToDefault(): void {
    this.showAsChart = false;
  }

  getSection(): string {
    return JSON.stringify(Array.from(this.stats));
  }
}
