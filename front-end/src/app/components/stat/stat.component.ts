import { Component, Input, OnInit } from '@angular/core';
import { DestinyStatPipe } from '../pipes/destinyStat/destiny-stat.pipe';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

  @Input()
  statName!: string;

  @Input()
  statValue!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
