import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
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

  chartableSections = Helper.chartableSections;

  stats = new Map<string, string>();

  isVisible = true;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
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

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Kills',
        backgroundColor: '#008080',
        hoverBackgroundColor: 'white'
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
    this.updateStats();

    this.newDisplayedStatsEvent.subscribe((fetchedStats) => {
      this.displayedStats = fetchedStats;
      this.updateStats();

      if (this.showAsChart == true) {
        this.convertToChart();
      }
    });

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

    this.barChartData.labels = Array.from(this.stats.keys());
    this.barChartData.datasets[0].data = Array.from(this.stats.values()).map((item) => {
      const destinyStatPipe = new DestinyStatPipe();
      return parseFloat(destinyStatPipe.transform(item, true));
    });

    this.chart?.update();
  }

  convertToDefault(): void {
    this.showAsChart = false;
  }

  getSection(): string {
    return JSON.stringify(Array.from(this.stats));
  }
}
