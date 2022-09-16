import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        // fade in
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
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
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class LandingPageComponent implements OnInit {

  blocks: any[] = [
    {
      heading: `Track your Destiny 2 stats.`,
      text: `See a summary of your Destiny 2 stats, along with aggregated stats for each of your characters.`,
      image: 'assets/StatsLandingPage.png'
    },
    {
      heading: `See graph summaries.`,
      text: `Arc Buddy shows you graph summaries for your characters' weapon kills, so you can see your favored (and least favored) weapons.`,
      image: 'assets/GraphLandingPage.png'
    },
    {
      heading: `Watch what in-game vendors are selling.`,
      text: `Vendors are always refreshing their inventory. Arc Buddy shows you their most up-to-date inventory so that you'll never miss that item (or mod) you want most.`,
      image: 'assets/VendorsLandingPage.png'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
