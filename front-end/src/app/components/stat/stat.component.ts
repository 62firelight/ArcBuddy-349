import { Component, Input, OnInit } from '@angular/core';
import { DestinyStatPipe } from '../pipes/destinyStat/destiny-stat.pipe';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        // fade in
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('0.1s ease-out', 
                    style({ }))
          ]
        ),
        // fade out
        transition(
          ':leave', 
          [
            style({ }),
            animate('0.1s ease-in', 
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
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
