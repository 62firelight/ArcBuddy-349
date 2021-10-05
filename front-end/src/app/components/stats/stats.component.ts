import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/Profile';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @Input() profile!: Profile;

  constructor() { }

  ngOnInit(): void {
  }

}
